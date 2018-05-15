<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
  <div class="field-items"<?php print $content_attributes; ?>>
    <?php foreach ($items as $delta => $item): ?>
      <div class="field-item <?php print $delta % 2 ? 'odd' : 'even'; ?>"<?php print $item_attributes[$delta]; ?>>
        <h2>Download form</h2>
        <ul>
          <li><?php print render($item); ?></li>
        </ul>
      </div>
    <?php endforeach; ?>
  </div>
</div>
