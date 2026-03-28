/**
 * Add Luxury Meta Box
 */
function add_car_luxury_meta_box() {
    add_meta_box(
        'car_luxury',
        __('⭐ Luxury Car', 'textdomain'),
        'render_car_luxury_meta_box',
        'cars',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'add_car_luxury_meta_box');

/**
 * Render Luxury Meta Box
 */
function render_car_luxury_meta_box($post) {
    wp_nonce_field('car_luxury_nonce_action', 'car_luxury_nonce');
    $car_luxury = get_post_meta($post->ID, 'car_luxury', true);
    ?>
    <style>
        .car-luxury-wrapper {
            padding: 15px;
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
            border-radius: 8px;
            border: 1px solid #fcd34d;
        }
        .car-luxury-checkbox-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #fcd34d;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .car-luxury-checkbox-row:hover {
            background: #fffbeb;
            box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }
        .car-luxury-checkbox-row input[type="checkbox"] {
            width: 22px;
            height: 22px;
            accent-color: #f59e0b;
            cursor: pointer;
        }
        .car-luxury-checkbox-row label {
            font-weight: 700;
            font-size: 14px;
            color: #92400e;
            cursor: pointer;
            margin: 0;
        }
        .car-luxury-hint {
            margin-top: 10px;
            font-size: 11px;
            color: #b45309;
            font-style: italic;
        }
    </style>
    <div class="car-luxury-wrapper">
        <div class="car-luxury-checkbox-row">
            <input
                type="checkbox"
                id="car_luxury"
                name="car_luxury"
                value="1"
                <?php checked($car_luxury, '1'); ?>
            />
            <label for="car_luxury">⭐ Mark as Luxury Car</label>
        </div>
        <p class="car-luxury-hint">
            ✅ When checked, this car will appear in the "Our Luxury Cars" section on the homepage.
        </p>
    </div>
    <?php
}

/**
 * Save luxury checkbox - Add this inside your existing save_car_meta_data() function
 */
function save_car_luxury_meta_data($post_id, $post) {
    if (isset($_POST['car_luxury_nonce']) && wp_verify_nonce($_POST['car_luxury_nonce'], 'car_luxury_nonce_action')) {
        $value = isset($_POST['car_luxury']) ? '1' : '0';
        update_post_meta($post_id, 'car_luxury', $value);
    }
}
add_action('save_post', 'save_car_luxury_meta_data');

/**
 * Expose luxury field in REST API - Add this inside your existing add_car_fields_to_rest_api() function
 */
function register_car_luxury_rest_field() {
    register_rest_field('cars', 'car_luxury', array(
        'get_callback' => function($object) {
            return get_post_meta($object['id'], 'car_luxury', true) === '1';
        },
        'schema' => array('type' => 'boolean'),
    ));
}
add_action('rest_api_init', 'register_car_luxury_rest_field');
