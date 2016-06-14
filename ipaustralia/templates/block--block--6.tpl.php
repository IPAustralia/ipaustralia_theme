<?php
  $theme_path = drupal_get_path('theme', 'ipaustralia');
  drupal_add_css($theme_path . '/va/css/ipAustraliaBlock.css');
  drupal_add_js($theme_path . '/va/scripts/customAlex.js', array('type' => 'file', 'scope' => 'footer'));
  drupal_add_js($theme_path . '/va/scripts/ipAustraliaBlock.js', array('type' => 'file', 'scope' => 'footer'));
?>
<div id="ipAustraliaBlock"></div>