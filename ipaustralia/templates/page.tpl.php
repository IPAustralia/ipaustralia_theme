<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KSCK47"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

<!-- ClickTale Top part -->
<script type="text/javascript">
var WRInitTime=(new Date()).getTime();
</script>
<!-- ClickTale end of Top part -->

<?php
include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/header.inc";
?>

<div class="main-container <?php if (isset($page_classes)): print implode(' ', $page_classes); endif; ?>">

  <div class="overlay"></div>

<!-- breadcrumb was here -->

  <?php if (!empty($messages)): ?>
    <div class="messages">
      <div class="container">
        <?php print $messages; ?>
      </div>
    </div>
  <?php endif; ?>

  <div class="title">
    <div class="container">
      <div class="col-sm-9">
        <?php print render($title_prefix); ?>
        <?php if (!empty($title)): ?>
        <h1 class="page-header" id="mainHeading"><?php print $title; ?></h1>
        <?php endif; ?>
        <?php print render($title_suffix); ?>
      </div>
      <div class="col-sm-3">
        <?php
        if (!empty($header_right_text)){
          print render($header_right_text);
        } else {
          // ugly workaround for standard pages as indexes
          $path_array = explode("/", drupal_get_path_alias());
          if(count($path_array == 2) && $path_array[0] == "ip-for-digital-business"){
            print('<a id="masthead-link" href="/ip-for-digital-business/">IP for digital business</a>');
          }
        }
        ?>
      </div>
    </div>
  </div>

  <?php print render($page['content_top']); ?>

  <div class="container">

    <?php if (!empty($page['sidebar_first'])): ?>
      <aside class="col-sm-3">
        <?php print render($page['sidebar_first']); ?>
      </aside>  <!-- /#sidebar-first -->
    <?php endif; ?>

    <section<?php print $variables['content_column_class']; ?> role="main" aria-labelledby="mainHeading">
      <a id="main-content"></a>

      <?php if (!empty($tabs)): ?>
        <?php print render($tabs); ?>
      <?php endif; ?>
      <?php if (!empty($page['help'])): ?>
        <?php print render($page['help']); ?>
      <?php endif; ?>
      <?php if (!empty($action_links)): ?>
        <ul class="action-links"><?php print render($action_links); ?></ul>
      <?php endif; ?>

      <?php if (!empty($breadcrumb)): ?>
        <div class="breadcrumbs" role="navigation">
          <div class="container">
             <?php print $breadcrumb; ?>
          </div>
        </div>
      <?php endif; ?>

      <?php print render($page['content']); ?>
    </section>

    <?php if (!empty($page['sidebar_second'])): ?>
      <aside class="col-sm-3" role="complementary">
        <?php print render($page['sidebar_second']); ?>
      </aside>  <!-- /#sidebar-second -->
    <?php endif; ?>

  </div>

  <?php print render($page['content_bottom']); ?>

</div>

<?php
include DRUPAL_ROOT . "/" . path_to_theme() . "/templates/includes/footer.inc";
?>

<!-- ClickTale Bottom part -->
<script type='text/javascript'>
document.write(unescape("%3Cscript%20src='"+(document.location.protocol=='https:'? "https://cdnssl.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js":"http://cdn.clicktale.net/www/ptc/8dd11315-763a-4246-bb54-dfc6d9cb1206.js") + "'%20type='text/javascript'%3E%3C/script%3E"));
</script>
<!-- ClickTale end of Bottom part -->
