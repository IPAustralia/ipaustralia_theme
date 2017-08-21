<?php
/**
 * @file
 * The primary PHP file for this theme.
 */

define('BLOCK_ID_FOOTER_MENU', 'menu_block-1');
define('BLOCK_ID_FOOTER_SUB_MENU', 'menu-menu-footer-sub-menu');
define('BLOCK_ID_IP_TOOLKIT_FOOTER_SUB_MENU', 'menu-menu-footer-ip-toolkit-sub-menu');
define('BLOCK_ID_TWITTER', 'twitter_block-1');
define('MENU_BLOCK_DELTA_SIBLINGS', 2);

/**
 * Implements hook_js_alter().
 */
function ipaustralia_js_alter(&$javascript) {
  // Bootstrap requires a later version of jquery.
  $javascript['misc/jquery.js']['data'] = drupal_get_path('theme', 'ipaustralia') . '/js/jquery-1.11.3.min.js';
}

/**
 * Implements hook_preprocess_html().
 */
function ipaustralia_preprocess_html(&$variables) {
  // Used to add class to body for the application process menu blocks to be targeted by generic styling.
  // Find if block is visible then add class to body.
  $node = menu_get_object();
  if (isset($node) && isset($variables['page']['content_top']['menu_block_8']) ||
    isset($node) && isset($variables['page']['content_top']['menu_block_9']) ||
    isset($node) && isset($variables['page']['content_top']['menu_block_10']) ||
    isset($node) && isset($variables['page']['content_top']['menu_block_7'])) {
    $variables['classes_array'][] = 'application-process-visible';
  }

  // Add section classes for each ip right (section-patents, section-designs etc.).
  $trail = menu_get_active_trail();
  if (!empty($trail[1]['link_title'])) {
    $variables['classes_array'][] = 'section-' . drupal_clean_css_identifier(strtolower($trail[1]['link_title']));
  }

  //add GTM script to the head tag
  $gtm_string = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KSCK47');";
  $script = array( 
    '#tag' => 'script',
    '#value' => $gtm_string
  );

  drupal_add_html_head($script, 'script');
}

/**
 * Implements hook_preprocess_page().
 */
function ipaustralia_preprocess_page(&$vars, $hook) {

  // Add Ip Toolkit Logo.
  $vars['iptoolkit_logo'] = theme('image', array(
    'path' => drupal_get_path('theme', 'ipaustralia') . '/images/DIIS_logo.png',
    'attributes' => array('class' => 'iptoolkit-logo'),
  ));

  // Add class to determine whether to use cookies or not.
  if (isset($vars['node'])) {
    $items = field_get_items('node', $vars['node'], 'field_ip_toolkit_section');
    if ($items) {
      $parents = array();
      foreach ($items as $item) {
        $item_parents = taxonomy_get_parents($item['tid']);
        if(isset($item_parents) && !empty($item_parents)) {
          $name = reset($item_parents)->name;
          if (!in_array($name, $parents)) {
            $parents[] = $name;
          }
        }
      }
      if (count($parents) >= 2) {
        if (!isset($vars['page_classes'])) {
          $vars['page_classes'] = array();
        }
        $vars['page_classes'][] = 'multiple-personas';
      }
    }
  }

  // Override the default primary nav render array. see
  // template.inc:template_preprocess_page() and
  // page.vars.php:bootstrap_preprocess_page() for where these variables are
  // originally set. see also http://dnotes.net/blogs/david-hunt/how-change-
  // theme-or-alter-drupal-7-primary-links-1063.
  // __ipaustralia_mega_menu() depends on menu_block being around, so just
  // leave the menu as is if menu_block isn't enabled.
  if (isset($vars['main_menu']) && !empty($vars['main_menu']) && module_exists('menu_block')) {
    $vars['primary_nav'] = __ipaustralia_mega_menu();
  }
  if (isset($vars['node']->type)) {
    // Allow page--type.tpl.php,
    // e.g. page--trade_mark_certification_rules.tpl.php
    $vars['theme_hook_suggestions'][] = 'page__' . $vars['node']->type;
  }
  if (drupal_is_front_page()) {
    // Homepage doesn't have sidebars.
    $vars['content_column_class'] = ' class="col-sm-12"';
  }
}

/**
 * Implements hook_theme_form_alter()
 */
function ipaustralia_form_alter(&$form, &$form_state, $form_id) {
  $policy_id = getFieldValueFromNode();
  echo $policy_id;
  echo '<pre>' . var_export($form) . '</pre>';
}

/**
 * @description: Helper: Get node field value
 *
 */
function getFieldValueFromNode() {
  global $node;
  $nid = $node->nid;
  $node = node_load($nid);
  return field_get_items('node', $node, 'field_policy_id');
}

/**
 * Implements hook_menu_block_tree_alter().
 */
function ipaustralia_menu_block_tree_alter(&$tree, &$config) {
  // Remove the current page from the "siblings" menu (i.e. we want this
  // menu to show all items at this level except for the page that we're
  // already looking at).
  if ($config['delta'] == MENU_BLOCK_DELTA_SIBLINGS) {
    $current_link = menu_link_get_preferred();
    foreach (element_children($tree) as $key) {
      $value = &$tree[$key];
      if ($value['link']['mlid'] == $current_link['mlid']) {
        unset($tree[$key]);
        break;
      }
    }
  }
}

/**
 * Implements hook_block_view_alter().
 */
function ipaustralia_block_view_alter(&$data, $block) {
  $bid = $block->module . '-' . $block->delta;
  if ($bid == BLOCK_ID_FOOTER_MENU) {
    /*
     * We want to add col-md-3 and col-sm-6 classes to the <li> elements
     * at the top level of our multilevel footer nav.
     *
     * We want the classes directly on the <li>, not on the <a>.
     * menu_attributes won't work since it only puts classes on the <a>
     * tag.
     *
     * We want the classes on the top level <li> elements only, so
     * theme_menu_link__menu_footer_menu() won't work, since that's called
     * for every level of the menu.
     *
     * We can't just add classes in hook_menu_block_tree_alter() because
     * menu_tree_output() runs afterwards and will reset any
     * #attributes->class we set. Similarly we can't set a #theme
     * suggestion in hook_menu_block_tree_alter() because
     * menu_block_tree_output() runs afterwards and will reset any #theme
     * we set.
     *
     * hook_preprocess_block() can't do it - we can add the classes to all
     * the element children of elements->#content in there, but by the
     * time preprocess_block is called the menu has already been rendered
     * in to $variables['content']. We can't use drupal_render() inside
     * hook_preprocess_block to rerender our content, since
     * drupal_render() calls theme() which calls hook_preprocess_block(),
     * so we'll recurse infinitely. We could copy some code out of
     * drupal_render() to try and rerender the content after adding our
     * classes, but that seems a bit nasty.
     *
     * I'd prefer to avoid dodgy hacks like rewriting the DOM with jquery
     * or rewriting the rendered content with regular expressions.
     *
     * So we use hook_block_view_alter().
     */
    foreach (element_children($data['content']['#content']) as $key) {
      $value = &$data['content']['#content'][$key];
      array_push($value['#attributes']['class'], 'col-md-3', 'col-sm-6');
    }
  }
  elseif ($bid == BLOCK_ID_TWITTER) {
    /*
     * Use our own custom markup for the "Connect With Us" social links /
     * Twitter feed block. Neither the twitter_block nor the
     * govcms_social_links modules meet our needs (e.g. no LinkedIn and we
     * want both the links and the Twitter feed inside the one block).
     *
     * It'd be nicer to define our own block with hook_block_info but that
     * doesn't work from inside a theme, and GovCMS won't let us have
     * custom modules, so we just hijack the Twitter block. we could also
     * put custom markup inside a bean, but it's a bit nasty to put
     * "structural" markup inside a block of "content".
     */
    $data = array(
      'subject' => 'Connect With Us',
      'content' => array(
        '#title' => 'Connect With Us',
        '#markup' => file_get_contents(dirname(__FILE__) . '/includes/connect_with_us.html'),
      ),
    );
  }
}

/**
 * Implements hook_preprocess_block().
 */
function ipaustralia_preprocess_block(&$vars) {
  // Add section-patents, section-trademarks, etc. so we can style based on
  // section of the site we're in (e.g. blocks under the patents section are
  // all tinted blue).
  $trail = menu_get_active_trail();
  if (!empty($trail[1]['link_title'])) {
    $vars['classes_array'][] = 'section-' . drupal_clean_css_identifier(strtolower($trail[1]['link_title']));
  }
  $bid = $vars['block']->module . '-' . $vars['block']->delta;
  // Some blocks need a <div class="container"> inside the <section>,
  // wrapping the block content. add a theme suggestion for that.
  $in_array = in_array($bid, array(
      BLOCK_ID_FOOTER_MENU,
      BLOCK_ID_FOOTER_SUB_MENU,
      BLOCK_ID_IP_TOOLKIT_FOOTER_SUB_MENU,
  ));
  if (($in_array || $vars['block']->region == 'content') && !($vars['block']->delta == 26)) {
    $vars['theme_hook_suggestions'][] = 'block__with_container';
  }
  elseif ($vars['block']->region == 'content_top') {
    $vars['theme_hook_suggestions'][] = 'block__app_process';
  }

}

/**
 * Implements hook_preprocess_region().
 */
function ipaustralia_preprocess_region(&$vars) {
  $region = $vars['region'];
  // Header blocks shouldn't have wrapper markup.
  switch ($region) {
    case 'content_top':
    case 'header':
      $vars['theme_hook_suggestions'][] = 'region__no_wrapper';
      break;

    case 'content_bottom':
      $vars['theme_hook_suggestions'][] = 'region__with_container';
      break;
  }
}

function ipaustralia_form_search_api_page_search_form_default_search_alter(&$form, &$form_state, $form_id) {
  // Update the placeholder text for the search form in the header.
  $form['keys_1']['#attributes']['placeholder'] = 'Search website';
}

/**
 * Implements hook_theme().
 */
function ipaustralia_theme($existing, $type, $theme, $path) {
  // Tell the theme registry code that we have some ipaustralia_menu_link__*
  // and ipaustralia_menu_tree_* theme hooks.
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

/**
 * Implements hook_menu_link().
 *
 * Intentionally overriding bootstrap_menu_link to avoid the "dropdown"
 * classes that we don't want.
 */
function ipaustralia_menu_link(array $variables) {
  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}

/**
 * Implements hook_file_link().
 */
function ipaustralia_file_link($variables) {
  $file = $variables['file'];
  $icon_directory = $variables['icon_directory'];

  $url = file_create_url($file->uri);

  $mimetype_name = '';
  {
    // Human-readable names, for use as text-alternatives to icons.
    $mime_name = array(
      'application/msword' => t('Microsoft Office document'),
      'application/vnd.ms-excel' => t('Office spreadsheet'),
      'application/vnd.ms-powerpoint' => t('Office presentation'),
      'application/pdf' => t('PDF'),
      'video/quicktime' => t('movie'),
      'audio/mpeg' => t('audio'),
      'audio/wav' => t('audio'),
      'image/jpeg' => t('image'),
      'image/png' => t('image'),
      'image/gif' => t('image'),
      'application/zip' => t('package'),
      'text/html' => t('HTML'),
      'text/plain' => t('plain text'),
      'application/octet-stream' => t('binary data'),
    );

    $mimetype = file_get_mimetype($file->uri);

    $mimetype_name = !empty($mime_name[$mimetype]) ? $mime_name[$mimetype] : t('File');
  }

  $icon = theme('file_icon', array(
    'file' => $file,
    'icon_directory' => $icon_directory,
    'alt' => $mimetype_name,
  ));

  // Set options as per anchor format described at
  // http://microformats.org/wiki/file-format-examples
  $options = array(
    'attributes' => array(
      'type' => $file->filemime . '; length=' . $file->filesize,
    ),
  );

  // Use the description as the link text if available.
  if (empty($file->description)) {
    $link_text = $file->filename;
  }
  else {
    $link_text = $file->description;
    $options['attributes']['title'] = check_plain($file->filename);
  }

  return
    '<span class="file">' .
    format_string(
      '!link !icon in @mimetype_name format [@size]',
      array(
        '!link' => l($link_text, $url, $options),
        '!icon' => $icon,
        '@mimetype_name' => $mimetype_name,
        '@size' => format_size($file->filesize),
      )
    ) .
    '</span>';
}


include_once dirname(__FILE__) . '/includes/megamenu.inc';
