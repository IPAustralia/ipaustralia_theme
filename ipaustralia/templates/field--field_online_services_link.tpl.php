<?php if ($element['#items'][0]['value']): ?>
	<div class="<?php print $classes; ?>"<?php print $attributes; ?>>
		<div>
			<h3>Submitting your form through online services</h3>
			<div class="field-items"<?php print $content_attributes; ?>>
				<ol>
					<li>Download the form from above section (Download form)</li>
					<li>Complete the form</li>
					<li>Sign in to or return to <a href="https://services.ipaustralia.gov.au/ICMWebUI" title="Link to online services">online services</a></li>
					<li>Choose the correct service request from online services and submit</li>
				</ol>
			</div>
			<h3>Submitting your form via post</h3>
			<div class="field-items"<?php print $content_attributes; ?>>
				<ol>
					<li>Download the form from above section (Download form)</li>
					<li>Complete the form</li>
					<li>Send the form to our postal address</li>
				</ol>
			</div>
			<h3>Postal address</h3>
			<div class="field-items"<?php print $content_attributes; ?>>
				<p>PO Box 200<br />
				Woden ACT 2606</p>
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
