<header id="navbar" role="banner">
    <div class="header">
        <div class="container">

            <?php if ($logo): ?>
                <a class="logo pull-left col-md-4" href="<?php print $front_page; ?>" title="IP Australia home">
                    <img src="<?php print $logo; ?>" alt="IP Australia" />
                </a>
            <?php endif; ?>
            <?php if (isset($iptoolkit_logo)): ?>
                <a href="http://www.industry.gov.au" title="Department of Industry, Innovation and Science"><?php print $iptoolkit_logo; ?></a>
            <?php endif; ?>
            <div class="col-md-8 header-right">
                <?php print render($page['header']); ?>
            </div>

            <div class="navbar-header">
                <button
                    type="button"
                    class="navbar-toggle collapsed"
                    aria-expanded="false"
                    title="Toggle navigation"
                    data-toggle="collapse"
                    data-target="#header-navigation-container">
                </button>
            </div>
        </div>
    </div>
</header>
<nav class="navbar-default" aria-label="Main navigation">
    <div class="container navbar-collapse collapse" id="header-navigation-container">
        <?php if (!empty($primary_nav)): ?>
            <?php print render($primary_nav); ?>
        <?php endif; ?>
        <?php if (!empty($page['nav'])): ?>
            <?php print render($page['nav']); ?>
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
<img id="print-logo" src="<?php print $logo; ?>" alt="IP Australia" />
