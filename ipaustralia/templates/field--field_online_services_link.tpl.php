<?php if ($element['#items'][0]['value']): ?>
	<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
		<img src="<?php echo base_path() . drupal_get_path('theme', 'ipaustralia') ?>/images/eservices-forms.jpg" alt="" />
		<div>

			<div class="field-label"<?php print $title_attributes; ?>>Online services</div>
			<div class="field-items"<?php print $content_attributes; ?>>
				<p><a href="https://services.ipaustralia.gov.au/ICMWebUI">Fill in and submit this form online using online services.</a></p>
				<p>Using online services is secure, convenient, and can save you money.</p>
			</div>
		</div>
	</div>
<?php else: ?>
	<?php /* the below comment is actually required - if this field.tpl.php
	returns absolutely no markup (i.e. when the field is supposed to be hidden)
	then Drupal will just display using the default theme_field(), so we'll end up
	showing the text "hide". the comment is enough markup to make sure this
	field.tpl.php is always used. */ ?>
	<!-- not showing online services form -->
<?php endif; ?>
