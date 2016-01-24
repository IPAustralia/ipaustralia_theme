<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <div class="field-items"<?php print $content_attributes; ?>>
    <?php foreach ($items as $delta => $item): ?>
      <div class="field-item <?php print $delta % 2 ? 'odd' : 'even'; ?>"<?php print $item_attributes[$delta]; ?>>
        <p>Or fill in and submit this form via post: <?php print render($item); ?></p>
        <p>Please check the time and costs pages for the latest fees.</p>
      </div>
    <?php endforeach; ?>
  </div>
</div>
