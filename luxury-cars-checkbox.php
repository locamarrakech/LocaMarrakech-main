<?php
/**
 * Plugin Name: Luxury Car Checkbox for LocaMarrakech
 * Description: Adds a checkbox to mark cars as luxury vehicles
 * Version: 1.0
 * Author: LocaMarrakech
 */

// Prevent direct file access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add luxury checkbox to car post editor
 */
function add_luxury_checkbox_to_car_editor() {
    add_meta_box(
        'car_luxury_meta_box',
        'Car Luxury Settings',
        'display_luxury_checkbox',
        'cars',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_luxury_checkbox_to_car_editor');

/**
 * Display the luxury checkbox in the meta box
 */
function display_luxury_checkbox($post) {
    wp_nonce_field_name = 'car_luxury_nonce';
    $is_luxury = get_post_meta($post->ID, 'car_is_luxury', true);
    
    ?>
    <div class="components-base-control">
        <div class="components-base-control__field">
            <label class="components-checkbox-control">
                <input
                    type="checkbox"
                    name="car_is_luxury"
                    id="car_is_luxury"
                    value="1"
                    <?php checked($is_luxury, true, true); ?> />
                <span class="components-checkbox-control__label">Mark as Luxury Car</span>
            </label>
            <p class="description">Check this box to feature this car in the "Our Luxury Cars" section on the homepage.</p>
        </div>
    </div>
    <?php
    wp_nonce_field($post->ID, $wp_nonce_field_name);
}

/**
 * Save the luxury checkbox value
 */
function save_luxury_checkbox_data($post_id, $post) {
    if (!isset($_POST['car_luxury_nonce']) || !wp_verify_nonce($_POST['car_luxury_nonce'], 'car_luxury_nonce')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (current_user_can('edit_post', $post_id)) {
        $is_luxury = isset($_POST['car_is_luxury']) ? 1 : 0;
        update_post_meta($post_id, 'car_is_luxury', $is_luxury);
    }
}
add_action('save_post', 'save_luxury_checkbox_data');

/**
 * Add luxury column to cars list in admin
 */
function add_luxury_column_to_cars_list($columns) {
    $columns['car_is_luxury'] = [
        'title' => 'Luxury',
        'meta_key' => 'car_is_luxury',
        'type' => 'boolean',
        'true_label' => 'Yes',
        'false_label' => 'No',
        'sortable' => true
    ];
    return $columns;
}
add_filter('manage_cars_posts_columns', 'add_luxury_column_to_cars_list');

/**
 * Display luxury status in the cars list column
 */
function display_luxury_column_content($column, $post_id) {
    if ($column === 'car_is_luxury') {
        $is_luxury = get_post_meta($post_id, 'car_is_luxury', true);
        if ($is_luxury) {
            echo '<span style="color: #22c55e; font-weight: bold;">✓ Luxury</span>';
        } else {
            echo '<span style="color: #999;">Standard</span>';
        }
    }
}
add_action('manage_cars_posts_custom_column', 'display_luxury_column_content');

/**
 * Add REST API support for luxury field
 */
function add_luxury_to_rest_api() {
    register_rest_field(
        'car_is_luxury',
        [
            'get_callback' => 'get_luxury_field',
            'update_callback' => 'update_luxury_field',
            'schema' => [
                'type' => 'boolean',
                'description' => 'Whether this car is marked as luxury',
            ],
        ]
    );
}
add_action('rest_api_init', 'add_luxury_to_rest_api');

/**
 * Get luxury field value for REST API
 */
function get_luxury_field($post) {
    return get_post_meta($post->ID, 'car_is_luxury', false);
}

/**
 * Update luxury field value for REST API
 */
function update_luxury_field($value, $post) {
    if (!current_user_can('edit_post', $post->ID)) {
        return new WP_Error('rest_cannot_edit', 'Sorry, you cannot edit this post.');
    }
    
    $is_luxury = (bool) $value;
    update_post_meta($post->ID, 'car_is_luxury', $is_luxury);
    return $is_luxury;
}

/**
 * Add quick edit to cars list for luxury status
 */
function add_luxury_quick_edit($actions, $post) {
    if (current_user_can('edit_post', $post->ID)) {
        $is_luxury = get_post_meta($post->ID, 'car_is_luxury', true);
        $luxury_text = $is_luxury ? 'Mark as Standard' : 'Mark as Luxury';
        $luxury_class = $is_luxury ? 'standard' : 'luxury';
        
        $actions['inline hide-if-no-js quick-luxury-toggle'] = sprintf(
            '<a href="#" class="button button-small %s" title="%s" onclick="toggleLuxuryStatus(%d); return false;">%s</a>',
            $luxury_class,
            esc_attr($luxury_text),
            $post->ID,
            esc_html($luxury_text)
        );
    }
    return $actions;
}
add_filter('post_row_actions', 'add_luxury_quick_edit');

/**
 * Add JavaScript for quick toggle
 */
function add_luxury_toggle_script() {
    ?>
    <script type="text/javascript">
    function toggleLuxuryStatus(postId) {
        var data = {
            action: 'toggle_luxury_status',
            post_id: postId,
            _wpnonce: '<?php echo wp_create_nonce("toggle_luxury_" . get_current_user_id()); ?>'
        };
        
        jQuery.post(ajaxurl, data, function(response) {
            if (response.success) {
                location.reload();
            }
        });
    }
    </script>
    <?php
}
add_action('admin_footer', 'add_luxury_toggle_script');

/**
 * Handle AJAX toggle request
 */
function handle_luxury_toggle_ajax() {
    check_ajax_referer();
    
    if (!current_user_can('edit_post', $_POST['post_id'])) {
        wp_die('Permission denied');
    }
    
    $post_id = intval($_POST['post_id']);
    $current_luxury = get_post_meta($post_id, 'car_is_luxury', true);
    $new_luxury = $current_luxury ? 0 : 1;
    
    update_post_meta($post_id, 'car_is_luxury', $new_luxury);
    
    wp_send_json_success(['success' => true]);
    wp_die();
}
add_action('wp_ajax_toggle_luxury_status', 'handle_luxury_toggle_ajax');

?>
