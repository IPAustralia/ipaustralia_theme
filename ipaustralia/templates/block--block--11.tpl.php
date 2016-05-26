<?php
	if(!$logged_in) {
		drupal_set_message(t($content), 'error');
	}
?>