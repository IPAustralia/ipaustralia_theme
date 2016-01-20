<?php
/**
 * @file
 * The primary PHP file for this theme.
 */
function ipaustralia_preprocess_page(&$vars, $hook) {
	// override the default primary nav render array. see
	// template.inc:template_preprocess_page() and
	// page.vars.php:bootstrap_preprocess_page() for where these variables are
	// originally set. see also http://dnotes.net/blogs/david-hunt/how-change-
	// theme-or-alter-drupal-7-primary-links-1063.
	// __ipaustralia_mega_menu() depends on menu_block being around, so just
	// leave the menu as is if menu_block isn't enabled.
	if ($vars['main_menu'] && module_exists('menu_block')) {
		$vars['primary_nav'] = __ipaustralia_mega_menu();
		// dpm($vars['primary_nav']);
	}
	if (isset($vars['node']->type)) {
		// allow page--type.tpl.php, e.g. page--trade_mark_certification_rules.tpl.php
		$vars['theme_hook_suggestions'][] = 'page__' . $vars['node']->type;
	}
}

function ipaustralia_preprocess_block(&$vars) {
	$classes = &$vars['classes_array'];
	// add section-patents, section-trademarks, etc. so we can style based on
	// section of the site we're in (e.g. blocks under the patents section are
	// all tinted blue)
	$trail = menu_get_active_trail();
	if (isset($trail[1])) {
		$classes[] = 'section-' . drupal_clean_css_identifier(strtolower($trail[1]['link_title']));
	}
}

function ipaustralia_form_search_api_page_search_form_default_search_alter(&$form, &$form_state, $form_id) {
	$form['keys_1']['#attributes']['placeholder'] = 'Search website';
}

function ipaustralia_theme($existing, $type, $theme, $path) {
	return array(
		'menu_link' => array(
			'pattern' => 'menu_link__',
			'render element' => 'element',
		),
		'menu_tree' => array(
			'pattern' => 'menu_tree__',
			'render element' => 'tree',
		),
	);
}

include_once dirname(__FILE__) . '/includes/megamenu.inc';
