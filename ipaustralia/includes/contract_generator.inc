<?php


function __ipaustralia_contract_generator(&$vars){
  if(isset($vars['form']['#node']->title)){
    if($vars['form']['#node']->title==='IP contract generator'){
      //__ipaustralia_contract_generator_migrate($vars);

      // Preprocess elements.
      foreach($vars['form']['submitted'] as $i=>$element){
        $formField =& $vars['form']['submitted'][$i];
        if(isset($formField['#type'])){
          $block_radio_titles = array('5 Law and Jurisdiction');
          $is_block_radio_list = in_array($formField['#title'], $block_radio_titles);

          $not_img_radio_titles = array('Disclaimer');
          $isImgRadio = !$is_block_radio_list && !in_array($formField['#title'], $not_img_radio_titles);

          if($formField['#type']==='radios'){

            $formField['#attributes']['class'][] =
              $is_block_radio_list ? 'block-radio-list__radios' : (
                $isImgRadio ? 'image-radios' : 'check-radio'
              );

            // Customise Radio options.
            foreach($formField as $j=>$option){
              $radioSettings =& $formField[$j];

              $isRadio = isset($radioSettings['#type']) && $radioSettings['#type']==='radio';

              if ($isRadio) {
                $inputValue = $radioSettings['#return_value'];

                $radioSettings['#title'] = '<span class="text">' . $radioSettings['#title'] . '</span>';

                if ($isImgRadio) {
                  $radioSettings['#prefix'] = '<div class="image-radios__item">';
                  $radioSettings['#suffix'] = '</div>';

                  $icons = array(
                    'one_way' => 'arrow-right',
                    'mutual' => 'hand-shake',
                    'company' => 'building',
                    'individual' => 'finger-print',
                    'partnership' => 'hand-shake',
                    'proprietary_limited_company' => 'building',
                    'sole_director_company' => 'finger-print',
                    '1_year' => '1',
                    '2_years' => '2',
                    '5_years' => '5',
                    'indefinite' => 'infinity',
                  );

                  foreach($icons as $label => $icon) {
                    if ($inputValue === $label) {
                      $radioSettings['#prefix'] = $radioSettings['#prefix'] . __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/images/contract-generator-icons/spaced/'.$icon.'.svg');
                    }
                  }
                }
              }
            }

            $formKey =& $formField['#webform_component']['form_key'];
            if(isset($formKey)){
              if($formField['#webform_component']['form_key']==='law_and_jurisdiction'){
                $formField['#prefix'] = '
                <fieldset class="block-radio-list">
                  <legend class="block-radio-list__outer-legend">' . $formField['#title'] . ' <span class="form-required" title="This field is required.">*</span></legend>
                  <fieldset class="block-radio-list__block">
                    <legend class="block-radio-list__block-legend">In What State or Territory is your business\' head office located?</legend>';
                $formField['#suffix'] = '</fieldset></fieldset>';
                $formField['#title'] = '';
              }
            }
          }else if($formField['#type']==='fieldset'){
            $formKey =& $formField['#webform_component']['form_key'];
            if(isset($formKey)){
              if($formKey==='individual'||$formKey==='2_b_individual'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/images/contract-generator-icons/tight/finger-print.svg') . '<span>';
              }else if($formKey==='1_c_partnership'||$formKey==='2_c_partnership'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/images/contract-generator-icons/tight/hand-shake.svg') . '<span>';
              }else if($formKey==='1_a_ii_sole_director_company'||$formKey==='2_a_ii_sole_director_company'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/images/contract-generator-icons/tight/building.svg') . '<span>';
              }else if($formKey==='1_a_i_company'||$formKey==='2_a_i_company'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/images/contract-generator-icons/tight/building.svg') . '<span>';
              }
            }
          }
        }
      }
      $vars['form']['actions']['submit']['#attributes']['class'][] = 'contract-generator-submit';
      $vars['form']['actions']['custom_js'] = array(
        '#markup' => __ipaustralia_contract_generator_custom_js($vars),
        '#weight' => 1000,
      );
    }
  }
}

function __ipaustralia_contract_generator_load_file($file){
  $myfile = fopen($file, "r") or die("Unable to open file!");
  $content = fread($myfile,filesize($file));
  fclose($myfile);
  return $content;
}

function __ipaustralia_contract_generator_custom_js(&$vars){
  $js = '<script src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/docxtemplater-latest.min.js"></script>';
  $js .= '<script src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/jszip.min.js"></script>';
  $js.='<script src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/file-saver.min.js"></script>';
  $js.='<script src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/jszip-utils.min.js"></script>';
  $js.='<!-- IE 6 to 9 --><!--[if IE]><script type="text/javascript" src="https://www.ipaustralia.gov.au/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/jszip-utils-ie.min.js"></script><![endif]-->';
  $js .= '<script type="text/javascript">';
  $js .= 'var form_id="#' . $vars['form']['#id'] . '";';
  $js .= __ipaustralia_contract_generator_load_file(DRUPAL_ROOT . '/sites/all/themes/ipaustralia/js/contract-generator.js');
  $js .= '</script>';
  return $js;
}

function __ipaustralia_contract_generator_migrate(&$vars){
      $save_file = DRUPAL_ROOT."/sites/all/themes/ipaustralia/contract-generator-webform.txt";
      if(isset($vars['form']['submitted']['version'])){
        if($vars['form']['submitted']['version']['#value'] === "1"){
        // Only run export when version is 1.
          echo "exists->export";
          $txt = serialize($vars['form']['#node']);
          $myfile = fopen($save_file, "w") or die("Unable to open file!");
          fwrite($myfile, $txt);
          fclose($myfile);
        }else if($vars['form']['submitted']['version']['#value'] === "0"){
        // Only run import when version is 0.
            if(file_exists($save_file)){
              echo "not-exists->import";
              $nid = $vars['form']['#node']->nid;
              $vid = $vars['form']['#node']->vid;
              $myfile = fopen($save_file, "r") or die("Unable to open file!");
              $txt = fread($myfile,filesize($save_file));
              $vars['form']['#node'] = unserialize($txt);
              fclose($myfile);

              $vars['form']['#node']->nid = $nid;
              $vars['form']['#node']->vid = $vid;
              //print_r($vars['form']['#node']->webform);
              node_save($vars['form']['#node']);
            }
          }
      }
}
