<header id="navbar" role="banner">

    <div class="header">
        <div class="container">

            <?php if ($logo): ?>
                <a class="logo pull-left col-md-4" href="<?php print $front_page; ?>" title="<?php print t('IP Australia'); ?>">
                    <img src="<?php print $logo; ?>" alt="<?php print t('IP Australia'); ?>" />
                </a>
            <?php endif; ?>
            <div class="col-md-8 header-right">
                <?php print render($page['header']); ?>
            </div>

        </div>
    </div>

    <nav class="navbar-default" role="navigation">
        
        <div class="navbar-header">
            <button 
                type="button" 
                class="navbar-toggle collapsed" 
                data-toggle="collapse" 
                data-target="#header-navigation-container">
            </button>
        </div>

        <div class="container navbar-collapse collapse" id="header-navigation-container">
            <?php if (!empty($primary_nav)): ?>
                <?php print render($primary_nav); ?>
            <?php endif; ?>
        </div>

    </nav>

    <?php if (!empty($page['highlighted'])): ?>
        <div class="highlighted jumbotron">
            <div class="container">

                <?php print render($page['highlighted']); ?>

            </div>
        </div>
    <?php endif; ?>

</header>
<img id="print-logo" src="<?php print $logo; ?>" alt="<?php print t('IP Australia'); ?>" />