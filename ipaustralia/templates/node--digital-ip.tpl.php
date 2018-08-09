<?php
  // standard page
  include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/page.tpl.php";

  // content type specific loads
  $digital_ip_path = drupal_get_path('theme', 'ipaustralia') . '/interactives/digital-ip';
  drupal_add_js($digital_ip_path . '/digital-ip.js', array('type' => 'file', 'scope' => 'footer'));
?>
