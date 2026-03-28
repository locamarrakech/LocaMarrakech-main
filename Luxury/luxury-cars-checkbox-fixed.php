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
 * Display luxury checkbox in the meta box
 */
function display_luxury_checkbox($post) {
    wp_nonce_field(wp_nonce_field_name('car_luxury_nonce'));
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
}

/**
 * Save luxury checkbox value
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
 * Display luxury status in cars list column
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
 * Register REST API field for luxury
 */
function register_luxury_rest_field() {
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
add_action('rest_api_init', 'register_luxury_rest_field');

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

?>
