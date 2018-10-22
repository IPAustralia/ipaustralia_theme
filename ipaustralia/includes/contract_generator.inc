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

                  $svgs = array(
                    'one_way' => '<svg viewBox="0 0 275.8 177.6"><path d="M163.4,54.4c-0.7-2.9-1.1-5.3-1.8-7.7c-1.6-5.8-0.3-10.7,4.6-14.3s10.4-3.9,15.8-0.8c11.8,6.8,23.5,13.7,35.2,20.5
  c16.7,9.7,33.4,19.5,50.1,29.3c6.8,4,6.8,10.9,0,14.9c-28.3,16.6-56.7,33.1-85.1,49.7c-9,5.3-20.1,0.3-21.1-9.8
  c-0.3-2.8,0.8-5.6,1.3-8.4c0.3-1.4,0.6-2.8,1-4.4H16.3c-7.6,0-11.5-3.8-11.5-11.5V65.5c0-7.1,4-11.1,11.2-11.1L163.4,54.4z
   M175,63.5h-3.4c-51.3,0-102.7,0-154,0c-3.6,0-3.6,0-3.6,3.5c0,14.5,0,29,0,43.4c0,3.8,0,3.8,3.8,3.8H175c-0.2,1.2-0.4,1.9-0.6,2.7
  c-1.3,5.4-2.6,10.9-3.9,16.3c-0.4,1.7-0.6,3.3,1,4.6c1.5,1.3,3.6,1.5,5.4,0.6c0.5-0.2,1-0.5,1.5-0.8l81.1-47.4
  c0.6-0.4,1.3-0.8,2.1-1.4l-5.2-3c-26-15.2-52-30.4-78-45.6c-2.2-1.3-4.4-2-6.7-0.4c-2.3,1.6-1.5,3.7-1,5.9
  C172.2,51.4,173.6,57.2,175,63.5z"/></svg>',
                    'mutual' => '<svg viewBox="0 0 258 177.6">
<path d="M75.1,34.3c5.9,5.4,13,7,20.4,8c2.9,0.4,4.6-0.1,6.6-2.5c1.8-2.2,4.8-3.7,7.6-4.6c8-2.8,16.4-3,24.8-3.7
  c13-1.1,25.5,1.2,37.9,4.3c4.4,1.1,8.7,1.3,13.1-0.6c-0.6-1.1-1.1-2.1-1.7-3.2c-2.5-4.6-1.4-8.8,2.9-11.5c4.9-3,9.8-6,14.7-9
  c4.6-2.8,8.9-1.7,11.5,3c11.9,21,23.7,42,35.5,63c1.2,2.1,2.4,4.2,3.5,6.3c2.1,3.7,0.9,8.3-2.7,10.5c-5.3,3.3-10.6,6.6-16,9.7
  c-3.9,2.3-8.2,1.1-10.6-2.8c-0.9-1.6-1.8-3.2-2.8-4.8L207.1,108c3.8,11.4-1.1,18.6-14.2,20.3c-3.6,10.3-5.2,11.8-15.2,13.4l-0.6,2.2
  c-1.8,6.8-5.9,10.3-13,10.6c-1.9,0-3.6,0.9-4.7,2.5c-6.3,8.3-14.8,9.6-24.3,7.5c-5-1.1-10-2.6-15.1-3.9c-6.9,11.7-21.2,7.9-25.5-3
  c-10.6,0.1-14.2-2.1-17.9-10.9c-11.5-1.2-15.6-4.9-16.9-15.5c-13.1-5.1-16.6-13.3-9.9-24l-9.4-11.4c-1.1,1.9-2,3.5-3,5.1
  c-2.6,4.4-6.9,5.6-11.2,3c-5-3-10-6-14.9-9.1c-4.4-2.7-5.6-6.9-3-11.5c10.1-18,20.2-36.1,30.4-54.1c2.8-4.9,5.5-9.8,8.3-14.6
  c2.7-4.7,7-5.8,11.5-3c4.8,2.9,9.6,5.8,14.3,8.7c4.9,3,6,7.1,3.2,12.2C75.7,33,75.4,33.7,75.1,34.3z M153.1,152.3
  c-0.8-0.4-1.4-0.8-2.1-1.1c-6.6-3.2-13.3-6.3-19.8-9.7c-1.3-0.7-2.3-2-2.7-3.5c-0.6-3.3,2.8-5.1,6.1-3.5c7.8,3.7,15.5,7.5,23.3,11.3
  c2.6,1.2,5.5,1.4,8.2,0.6c2.5-0.7,3.1-3,3.7-5.2s-1.4-2.3-2.5-2.9c-8.5-5-17.1-10-25.7-14.9c-2-1.1-3.4-2.5-2.7-5
  c0.8-2.8,3.5-3.6,6.4-1.9c9.2,5.3,18.4,10.6,27.6,16c2.9,1.7,5.7,1.4,8.5,0.5c2.5-0.9,3.2-3.1,3.6-5.5c0.4-2.4-1.3-2.8-2.7-3.7
  c-10.2-6.1-20.4-12.2-30.6-18.4c-2.5-1.5-3.2-3.7-2-5.8s3.5-2.4,6.1-0.9c1.2,0.7,2.3,1.4,3.5,2.1c10.3,6.1,20.5,12.3,30.8,18.5
  c2.8,1.8,6.4,1.4,8.8-0.9c2.2-2.1,2.4-5.5,0.5-7.9c-0.9-1-1.8-2-2.9-2.8c-20.5-16.8-42.2-31.9-66-43.8c-2.8-1.4-8.5-0.1-10.5,2.5
  c-3.8,5.3-8.8,9.8-14.6,13c-4.8,2.7-10.4,3.9-15.9,3.3c-4.8-0.6-7.4-3.7-7.5-8.4c-0.2-5.4,2.6-9.6,5.3-13.8
  c2.2-3.5,4.6-6.8,7.2-10.7c-8.8-0.6-16.5-3-23.3-8.6L44.5,88.5l10.3,12.3c7.3-6.3,14.1-5.1,22.1,3.9c3.5-5.9,8.5-8.7,15.3-6.7
  c7.1,2.1,10.4,7.5,10.9,14.7c7.9,1.8,13.5,7.3,13,17.4c5.2,1.2,9.1,4.1,11.2,9.1c2.1,5,1.4,10-2.3,14.5c6.1,1.8,11.8,3.6,17.8,3.8
  C147,157.6,150.3,155.8,153.1,152.3L153.1,152.3z M89.2,75c2,0,3.9-0.1,5.8-0.3c6.6-1.2,12.5-5,16.3-10.6c3.6-5.1,8.2-7.5,13.8-8.8
  c0.2,0,0.5-0.1,0.7-0.2c1.9-0.8,4-0.6,5.7,0.5c24.6,12.2,47.1,27.5,68.4,44.9c1.2,1,2.1,1.1,3.1,0.2c4.4-3.7,8.7-7.4,13.1-11.1
  c-9-16.1-17.8-31.7-26.8-47.5c-7.9,3.6-15.6,2.3-23.4,0.3c-9.2-2.4-18.6-4.1-28.2-3.2c-8.5,0.8-16.9,1.9-25.4,3.1
  c-1.7,0.2-3.3,1.1-4.4,2.4c-5.8,8.1-11.4,16.4-17,24.7C90.1,70.8,89.9,72.8,89.2,75z M54.1,18C41,41.3,28,64.4,14.9,87.6l15.6,9.7
  c13.1-23.3,26.1-46.4,39.2-69.6L54.1,18z M190.3,27.5c13.1,23.3,26.1,46.5,39.2,69.7l15.7-9.6L205.9,18L190.3,27.5z M75,138.9
  c1-0.6,1.9-1.3,2.8-2c0.6-0.7,1.2-1.5,1.7-2.3c4.8-6.4,9.6-12.7,14.4-19.1c2.1-2.8,1.4-6.6-1.8-9c-2.8-2.1-5.5-1.7-7.8,1.4
  c-5.1,6.9-10.1,13.8-15.2,20.6c-1.5,1.8-1.7,4.3-0.6,6.3C69.6,137,71.5,138.5,75,138.9z M91.5,149.9c0.9-0.3,1.8-0.9,2.5-1.5
  c4.6-6,9.1-12.1,13.5-18.3c1.8-2.5,0.4-6.3-2.5-8.3s-5.3-1.5-7.4,1.3c-4.1,5.5-8.1,11.1-12.2,16.6c-1.5,1.8-1.7,4.3-0.5,6.3
  C86.1,148.5,88.7,150,91.5,149.9L91.5,149.9z M120.5,145.3c0-3.8-2.6-7.3-5.7-7.5c-1.5-0.1-3.1,0.4-4.2,1.5
  c-2.9,3.5-5.6,7.2-8.2,10.9c-1.7,2.5-0.4,6.4,2.4,8.3s5.3,1.6,7.4-1.3c2.3-3.1,4.7-6.3,7-9.4C119.8,147.1,120.2,146.2,120.5,145.3
  L120.5,145.3z M70.4,112.2c0.2-3.3-1.9-6.3-5-7.3c-2.4-0.8-3.9-0.1-6,2.7c-1.1,1.7-2.3,3.3-3.6,4.8c-3.2,3.3-0.9,8.5,2.7,10.2
  c2.3,1,4.4,0.7,5.8-1.2c1.8-2.3,3.6-4.7,5.2-7.2C70,113.6,70.3,112.9,70.4,112.2z"/>
</svg>',
'company' => '<svg viewBox="0 0 181.4 177.6"><path d="M21.2,153.6v-3.5c0-31.6,0-63.2,0-94.8c-0.2-2.1,0.9-4.1,2.7-5.1C45.2,36.5,66.4,22.6,87.6,8.7c1.7-1.4,4.2-1.4,5.9,0
    c21.3,14,42.7,27.9,64.1,41.7c1.6,1,2.5,2.8,2.3,4.6c0,31.7,0,63.3,0,95v3.5H171c5.8,0,5.8,0,5.8,5.9c0,2.7,0,5.4,0,8.2
    c0,3.6-0.6,4.2-4.1,4.2H9.2c-4.6,0-4.9-0.3-4.9-4.9v-9.4c0-3.3,0.7-4,3.9-4C12.5,153.6,16.7,153.6,21.2,153.6z M154.2,153.5
    c0.1-1,0.1-1.8,0.1-2.7c0-31.1,0-62.2,0.1-93.3c0.1-1.6-0.7-3.1-2.1-3.9c-20-13-40-26-59.8-39c-1.1-0.9-2.7-0.9-3.8,0
    C68.6,27.7,48.5,40.8,28.4,53.8c-1.2,0.7-1.9,2-1.7,3.3c0,31.3,0,62.6,0,93.8c0,0.8,0.1,1.7,0.1,2.4h50.9v-28.7c0-3.2,0.8-4,3.9-4
    c5.8,0,11.7,0,17.5,0c3.3,0,4.1,0.8,4.1,4.1c0,8.6,0,17.3,0,25.9c0,0.9,0.1,1.9,0.1,2.8L154.2,153.5z M9.7,159v4.1
    c0,3.3,0,3.3,3.2,3.3h158.3V159H9.7z M97.8,153.5v-27.2H83.4v27.2H97.8z"/>
  <path d="M50.6,99c2.8,0,5.6,0,8.4,0c1.9,0,3.2,0.8,3.2,2.7s-1.4,2.8-3.2,2.8c-5.5,0-11,0-16.5,0c-1.9,0-3.4-0.8-3.3-2.9
    c0.1-1.9,1.5-2.6,3.4-2.6C45.2,99.1,47.9,99,50.6,99z"/>
  <path d="M90.7,99h8.4c1.8,0,3,0.8,3.1,2.6s-1.2,2.8-2.9,2.8c-5.8,0.1-11.5,0.1-17.3,0c-1.7,0-2.9-0.9-2.9-2.8s1.2-2.7,3-2.7
    L90.7,99z"/>
  <path d="M130.5,104.5c-2.6,0-5.3,0-7.9,0s-3.7-0.9-3.6-2.8c0.1-2.3,1.6-2.7,3.5-2.6c5.3,0,10.7,0,16,0c1.9,0,3.4,0.4,3.5,2.7
    s-1.5,2.8-3.4,2.8C135.9,104.6,133.2,104.5,130.5,104.5z"/>
  <path d="M50.9,72.2c-2.9,0-5.8,0-8.6,0c-1.8,0-3.1-0.7-3.1-2.5c-0.1-1.8,1.2-2.9,3.1-2.9c5.7,0,11.3,0,17,0c1.7,0,3,0.8,3,2.7
    c0,2-1.3,2.7-3.2,2.7C56.3,72.1,53.6,72.2,50.9,72.2z"/>
  <path d="M130.3,72.2c-2.7,0-5.4,0-8.1,0c-1.8,0-3.2-0.6-3.1-2.7c0-1.9,1.3-2.7,3-2.7c5.7,0,11.3,0,17,0c1.9,0,3.1,0.9,3,2.9
    s-1.4,2.5-3.1,2.5C136,72.2,133.1,72.2,130.3,72.2z"/>
  <path d="M90.4,72.2c-2.8,0-5.6,0-8.4,0c-1.8,0-3-0.7-3-2.6c0-1.9,1.2-2.7,2.9-2.8c5.8,0,11.5,0,17.2,0c1.4-0.2,2.7,0.9,2.9,2.3
    c0,0.2,0,0.3,0,0.5c0,1.8-1.3,2.6-3.1,2.6C96.2,72.2,93.3,72.2,90.4,72.2z"/>
</svg>',
'individual' => '<svg viewBox="0 0 173.5 177.6">
  <path d="M88.4,70.1c3.8,0,7.5,1.2,10.5,3.5c10.7,7.4,18.3,17.3,24.5,28.5c0.8,1.4,1.5,2.8,2.1,4.3c0.9,2.2,0.4,4.1-1.4,5
    s-3.8,0.2-4.9-2c-4.2-8.9-9.9-17-17-23.9c-2.7-2.5-5.6-4.8-8.7-6.8c-4.3-2.7-9.1-2-13.3,1.4c-4,3.2-5.8,8.2-4.3,12.3
    c0.6,1.6,1.6,3.1,2.8,4.3c7.5,7.1,14.4,14.5,19,23.9c7.2,14.8,7.5,30.2,3.8,45.9c-0.3,1.9-2,3.2-3.8,2.9c-0.2,0-0.3-0.1-0.5-0.1
    c-2-0.5-2.9-2.3-2.4-4.7c2.9-12.4,2.9-24.7-1.8-36.8c-3.9-9.9-10.3-18.1-18.3-24.9C69.2,98.1,67.1,90,69.8,83
    C72.9,75.3,80.2,70.2,88.4,70.1z"/>
  <path d="M90,25.3c13.7-0.1,27.8,5.9,40.6,15.6c16.1,12.2,27.6,28,35.8,46.4c0.5,0.9,0.7,2,0.6,3c-0.2,1.6-1.5,2.8-3.1,2.8
    c-2,0.2-3-1-3.8-2.7c-4.4-10-10.2-19.4-17.2-27.8c-8.3-10.1-18-18.4-29.7-24.2c-15.8-7.8-31.9-8.1-48.3-1.7
    c-3.5,1.5-5.4,1.1-6.3-1.2s0.3-3.8,3.6-5.2C70.3,26.9,78.7,25.3,90,25.3z"/>
  <path d="M85,39.8c9.5,0.2,17.5,1.7,25.1,5.4c1.2,0.5,2.2,1.5,2.8,2.6c0.3,1-0.1,3.1-0.9,3.5c-1.3,0.7-2.9,0.8-4.3,0.3
    c-7.5-3.6-15.7-5.2-24-4.7c-16.8,1.1-28.1,10.2-34.9,25.2c-6.2,13.9-4.3,27.3,3.7,39.9c0.5,0.9,1.2,1.7,1.7,2.6
    c1.1,1.8,0.9,3.8-0.7,4.9c-1.5,1.1-3.7,0.8-4.8-0.7c-0.1-0.1-0.1-0.2-0.2-0.3c-3.7-5.1-6.6-10.8-8.5-16.8
    c-7.9-24.7,9.3-57,37.8-61.3C80.6,40.1,83.4,40,85,39.8z"/>
  <path d="M84.7,54.1c12.1,0.4,20.8,4.2,28.2,10.9c15.8,14.2,26.1,32,32.1,52.2c2,6.9,3.2,14,4.5,21c0.1,1.3-0.5,2.6-1.4,3.4
    c-1.1,0.6-2.4,0.6-3.5,0.1c-1-0.8-1.6-1.9-1.8-3.1c-2.1-15.8-7.3-31-15.3-44.8c-5.5-9.3-12-17.8-20.4-24.6
    c-6.8-5.6-14.4-8.8-23.4-7.8c-2.1,0.3-4.2,0.9-6.2,1.6c-2.7,0.8-4.5,0.3-5.2-1.7s0.1-3.9,2.8-4.7C78.8,55.4,82.7,54.6,84.7,54.1z"
    />
  <path d="M82.1,152.2c-0.1-16.9-5.8-29.1-17-38.7c-13.2-11.4-13.8-31.3-6-43.5c0.4-0.8,1-1.5,1.6-2.1c1.2-1.2,3.2-1.2,4.4,0
    c1.7,1.4,1.7,3.2,0.4,4.9C62,78,60.4,84.3,61.1,90.6c0.6,6.3,2.7,11.9,7.4,16.4c5.9,5.7,11.9,11.4,15.3,19.2
    c5.6,12.8,7.1,25.9,2.8,39.4c-0.2,0.8-0.5,1.5-0.9,2.2c-0.8,1.7-2.8,2.5-4.6,1.8c-1.7-0.8-2.5-2.8-1.8-4.6
    C81.1,161,82,156.6,82.1,152.2z"/>
  <path d="M91.9,13.5c0,2.1-1.3,3.3-3.8,3.3c-9,0.1-17.8,1.8-26.2,4.9C43,29.1,29.1,41.8,20.5,60.2c-0.7,1.5-1.4,3.1-3.4,3.3
    c-3,0.3-4.9-2.5-3.3-5.4c3.4-6,6.5-12.4,10.8-17.7c16.1-19.9,37.3-29.8,62.9-30.4C90.5,10.1,91.9,11.2,91.9,13.5z"/>
  <path d="M119.2,150.4c-0.2,3.6-0.3,6.8-0.5,10c-0.2,2.3-1.4,3.4-3.5,3.4s-3.1-1.3-3.2-3.6c-0.3-7.8-0.1-15.7-1-23.4
    c-2.2-18.1-9.9-33.2-24.8-44.3c-3-2.3-3.7-4.2-2.1-6.1s3.4-1.6,6.5,0.7c17,12.8,25.2,30.3,27.7,51
    C118.7,142.1,118.9,146.4,119.2,150.4z"/>
  <path d="M124.7,57.3c1,0.5,2,1,2.8,1.7c16.1,16.9,27.9,36.3,33,59.3c0.6,2.7-0.3,4.5-2.3,5s-3.8-0.8-4.4-3.5
    c-4.7-20.9-15.3-38.6-29.6-54.2c-0.7-0.8-1.7-1.4-2-2.3c-0.5-1.2-0.5-2.5-0.2-3.8C122.3,58.6,123.7,58.1,124.7,57.3z"/>
  <path d="M59.8,150.8c-1.4,3.4-2.7,6.9-4.4,10.2c-0.9,1.8-2.8,2.2-4.6,1.1c-1.6-0.8-2.2-2.8-1.4-4.4c0-0.1,0.1-0.1,0.1-0.2
    c0-0.1,0.1-0.2,0.1-0.2c4.4-6.3,2.2-11.8-2.2-16.9c-4.1-4.7-8.5-9.1-12.5-13.9c-5.3-6.3-9-13.9-10.6-22c-0.1-0.6-0.2-1.3-0.2-1.9
    c-0.2-1.6,0.9-3.1,2.6-3.4c0,0,0.1,0,0.1,0c1.9-0.3,3.6,0.4,3.9,2.3c2.2,13.2,10.6,22.6,19.6,31.6c4.1,4.1,7.4,8.8,8.6,14.7
    c0.2,0.9,0.3,1.7,0.4,2.6L59.8,150.8z"/>
  <path d="M108.5,12.4c2.4,0.8,5.7,1.7,8.9,2.9c14.2,5.2,26.6,14.4,35.8,26.4c2.2,2.9,2.4,4.8,0.6,6.3s-3.9,0.8-6.1-2
    c-9.9-12.9-23.8-22.2-39.6-26.4c-0.6-0.1-1.2-0.3-1.8-0.5c-1.7-0.5-2.8-2.2-2.4-4C104.2,13.3,105.7,12.3,108.5,12.4z"/>
  <path d="M6.5,89.8c1.1-6.9,2.2-13.8,3.4-20.7c0.4-2.1,1.4-3.6,3.9-3.4c2.4,0.2,3.6,2.1,2.9,4.9c-2,7.1-2.8,14.4-2.6,21.8
    c0.3,7.4,1.7,14.8,4.2,21.8c0.4,1.4,0.3,2.9-0.4,4.2c-1.5,2.3-4.9,1.4-5.9-1.4c-2.5-6.6-4-13.5-4.5-20.5c-0.2-2.2,0-4.3,0-6.5
    L6.5,89.8z"/>
  <path d="M23.3,82.8c1.5-12.4,6.3-24.1,14.1-33.8c2.2-2.6,4.5-5.1,7-7.5c1.7-1.7,4-1.7,5.3-0.3c1.3,1.4,1.2,3.7-0.7,5.4
    C38.7,56.2,32.1,69,30.3,82.9c-0.4,2.7-1.9,4.1-4,3.8C24.4,86.5,23.1,84.8,23.3,82.8z"/>
  <path d="M73.8,149.1c0,5-1.1,9.9-3.1,14.4c-1.2,2.6-3,3.5-5.1,2.5s-2.4-2.7-1.3-5.3c4.6-11.3,3.5-21.5-5.5-30.4
    c-1.8-1.8-1.9-3.8-0.5-5.3s3.5-1.5,5.3,0.3C70.3,131.4,74,140.1,73.8,149.1z"/>
  <path d="M22.4,126.1c1.2,1,2.4,1.6,3,2.5c4.6,7,10.3,13.2,16.9,18.4c1.9,1.5,2.2,3.6,0.9,5.2s-3.3,1.7-5.3,0.2
    c-7.2-5.5-13.4-12.4-18.2-20.1c-0.6-1.3-0.7-2.7-0.2-4C19.7,127.4,21.1,126.9,22.4,126.1z"/>
  <path d="M134.6,145.4c0,2.2,0.1,4.5,0,6.7c0,1.9-1.5,3.4-3.4,3.4c-1.9,0-3.4-1.5-3.4-3.4c0-0.1,0-0.3,0-0.4
    c0.4-8.6-0.3-17.3-2.3-25.7c-0.5-2.3,0.5-4,2.5-4.5c1.8-0.5,3.7,0.6,4.1,2.4c0,0.2,0.1,0.3,0.1,0.5c1.2,6.9,2.2,13.8,3.3,20.8
    L134.6,145.4z"/>
</svg>',
'1_year' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 178"><polygon points="123.76 7 88.58 37.79 88.58 78.25 123.76 47.46 123.76 170.59 161.58 170.59 161.58 7 123.76 7"/></svg>',
                    '2_years' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 178"><path d="M72.74,56.72h37.51S108.5,40.14,125.08,41s14.83,11.34,14.83,15.7,2.62,7-29.66,39.26-37.51,41.87-37.51,41.87V171H177.42V137.85H118.1s15.7-17.45,33.15-35.77,33.15-33.15,21.81-65.43S130.31,7,122.46,7,74.48,11.35,72.74,56.72Z"/></svg>',
                    '5_years' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 178"><path d="M72.07,120.06h37.35c.51,2.14.89,4.28,1.53,6.33,2.37,7.52,7.3,11,14.91,10.74,6.8-.27,11.71-4.38,13.26-11.68a51.33,51.33,0,0,0-.24-23.13c-1.75-7.14-5.86-10.77-12.38-11.26q-11.58-.87-15.91,9.23l-1.06,2.48H75.34V7.28H174V40.87H109.4v24c4.58-1.49,9.19-3.65,14-4.45,24.22-4,45.36,7.44,51.91,32.93a80.77,80.77,0,0,1-.39,43.35c-5.3,17.84-18,28.7-36.14,32.65-15.74,3.44-31,1.71-45-6.83-11.11-6.79-17.46-17-19.93-29.66C73.08,128.73,72.69,124.54,72.07,120.06Z"/></svg>',
                    'indefinite' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 178">
  <path d="M125,123.22a87.18,87.18,0,0,1-21.47,17,65.29,65.29,0,0,1-38,8.07c-9.07-.79-17.76-2.81-25.8-7.18C26.67,134,18.44,123,14.48,108.9c-4.16-14.81-4-29.68,1.32-44.2,6.52-18,19.48-29,37.94-33.48,24.47-5.92,45.93.27,64.64,16.78,2.3,2,4.45,4.22,6.69,6.35,2.73-2.53,5.38-5.21,8.25-7.64,9.87-8.36,20.93-14.59,33.83-16.59,18-2.78,35.1-.32,50.12,10.82,10.1,7.5,16.09,17.84,19,30,3.44,14.17,3.1,28.28-1.9,42-6.62,18.14-19.74,29.2-38.42,33.59-23.78,5.59-44.78-.23-63.19-16-1.36-1.16-2.65-2.39-4-3.6S126.34,124.52,125,123.22ZM158,90.44c3,3.08,5.83,6.17,8.85,9.07a21,21,0,0,0,4.48,3.15,14.19,14.19,0,0,0,17.73-3.19c4.14-5.11,4-13.79-.25-18.76-4.52-5.25-12.49-6.15-18.82-2.11C165.28,81.6,161.85,85.91,158,90.44Zm-66.08-.09c-2.42-3.87-8.53-9.9-12.3-12.09a14.53,14.53,0,0,0-9.58-2.07A13.08,13.08,0,0,0,58.67,86c-1.62,5.93.2,12.14,4.53,15.53,5.16,4,12.43,3.86,18.29-.47C85.56,98,88.77,94.2,91.93,90.35Z"/>
</svg>',
'tight_building'=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172.5 164.15">
  <path d="M16.9,146V47.65a5.29,5.29,0,0,1,2.7-5.1C40.9,28.85,62.1,15,83.3,1.05a4.67,4.67,0,0,1,5.9,0q32,21,64.1,41.7a4.85,4.85,0,0,1,2.3,4.6v98.5h11.1c5.8,0,5.8,0,5.8,5.9V160c0,3.6-.6,4.2-4.1,4.2H4.9c-4.6,0-4.9-.3-4.9-4.9v-9.4c0-3.3.7-4,3.9-4C8.2,146,12.4,146,16.9,146Zm133-.1a25.28,25.28,0,0,0,.1-2.7q0-46.65.1-93.3A4.17,4.17,0,0,0,148,46C128,33,108,20,88.2,7a3,3,0,0,0-3.8,0Q54.25,26.6,24.1,46.15a3.31,3.31,0,0,0-1.7,3.3v93.8c0,.8.1,1.7.1,2.4H73.4V117c0-3.2.8-4,3.9-4H94.8c3.3,0,4.1.8,4.1,4.1V143c0,.9.1,1.9.1,2.8ZM5.4,151.35v4.1c0,3.3,0,3.3,3.2,3.3H166.9v-7.4Zm88.1-5.5v-27.2H79.1v27.2Z"/>
  <path d="M46.3,91.35h8.4c1.9,0,3.2.8,3.2,2.7s-1.4,2.8-3.2,2.8H38.2c-1.9,0-3.4-.8-3.3-2.9.1-1.9,1.5-2.6,3.4-2.6C40.9,91.45,43.6,91.35,46.3,91.35Z"/>
  <path d="M86.4,91.35h8.4c1.8,0,3,.8,3.1,2.6a2.61,2.61,0,0,1-2.9,2.8c-5.8.1-11.5.1-17.3,0A2.6,2.6,0,0,1,74.8,94c0-1.9,1.2-2.7,3-2.7Z"/>
  <path d="M126.2,96.85h-7.9c-2.6,0-3.7-.9-3.6-2.8.1-2.3,1.6-2.7,3.5-2.6h16c1.9,0,3.4.4,3.5,2.7s-1.5,2.8-3.4,2.8C131.6,97,128.9,96.85,126.2,96.85Z"/>
  <path d="M46.6,64.55H38c-1.8,0-3.1-.7-3.1-2.5s1.2-2.9,3.1-2.9H55c1.7,0,3,.8,3,2.7s-1.3,2.7-3.2,2.7C52,64.45,49.3,64.55,46.6,64.55Z"/>
  <path d="M126,64.55h-8.1c-1.8,0-3.2-.6-3.1-2.7,0-1.9,1.3-2.7,3-2.7h17c1.9,0,3.1.9,3,2.9s-1.4,2.5-3.1,2.5Z"/>
  <path d="M86.1,64.55H77.7c-1.8,0-3-.7-3-2.6s1.2-2.7,2.9-2.8H94.8a2.66,2.66,0,0,1,2.9,2.3V62c0,1.8-1.3,2.6-3.1,2.6Z"/>
</svg>',
'tight_finger_print'=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160.53 159.85">
  <path d="M81.9,60.1a17.23,17.23,0,0,1,10.5,3.5c10.7,7.4,18.3,17.3,24.5,28.5a34.18,34.18,0,0,1,2.1,4.3c.9,2.2.4,4.1-1.4,5s-3.8.2-4.9-2a82.06,82.06,0,0,0-17-23.9A63.6,63.6,0,0,0,87,68.7c-4.3-2.7-9.1-2-13.3,1.4-4,3.2-5.8,8.2-4.3,12.3a12.31,12.31,0,0,0,2.8,4.3c7.5,7.1,14.4,14.5,19,23.9,7.2,14.8,7.5,30.2,3.8,45.9a3.36,3.36,0,0,1-3.8,2.9c-.2,0-.3-.1-.5-.1-2-.5-2.9-2.3-2.4-4.7,2.9-12.4,2.9-24.7-1.8-36.8A62.89,62.89,0,0,0,68.2,92.9,18.09,18.09,0,0,1,63.3,73,20.38,20.38,0,0,1,81.9,60.1Z"/>
  <path d="M83.5,15.3c13.7-.1,27.8,5.9,40.6,15.6,16.1,12.2,27.6,28,35.8,46.4a5.25,5.25,0,0,1,.6,3,3.13,3.13,0,0,1-3.1,2.8c-2,.2-3-1-3.8-2.7a117.26,117.26,0,0,0-17.2-27.8c-8.3-10.1-18-18.4-29.7-24.2-15.8-7.8-31.9-8.1-48.3-1.7-3.5,1.5-5.4,1.1-6.3-1.2s.3-3.8,3.6-5.2C63.8,16.9,72.2,15.3,83.5,15.3Z"/>
  <path d="M78.5,29.8c9.5.2,17.5,1.7,25.1,5.4a5.9,5.9,0,0,1,2.8,2.6c.3,1-.1,3.1-.9,3.5a5.37,5.37,0,0,1-4.3.3,48.51,48.51,0,0,0-24-4.7C60.4,38,49.1,47.1,42.3,62.1,36.1,76,38,89.4,46,102c.5.9,1.2,1.7,1.7,2.6,1.1,1.8.9,3.8-.7,4.9a3.47,3.47,0,0,1-4.8-.7c-.1-.1-.1-.2-.2-.3a59.09,59.09,0,0,1-8.5-16.8c-7.9-24.7,9.3-57,37.8-61.3C74.1,30.1,76.9,30,78.5,29.8Z"/>
  <path d="M78.2,44.1c12.1.4,20.8,4.2,28.2,10.9,15.8,14.2,26.1,32,32.1,52.2,2,6.9,3.2,14,4.5,21a4.25,4.25,0,0,1-1.4,3.4,3.92,3.92,0,0,1-3.5.1,5,5,0,0,1-1.8-3.1A121.08,121.08,0,0,0,121,83.8c-5.5-9.3-12-17.8-20.4-24.6-6.8-5.6-14.4-8.8-23.4-7.8A33.22,33.22,0,0,0,71,53c-2.7.8-4.5.3-5.2-1.7s.1-3.9,2.8-4.7C72.3,45.4,76.2,44.6,78.2,44.1Z"/>
  <path d="M75.6,142.2c-.1-16.9-5.8-29.1-17-38.7C45.4,92.1,44.8,72.2,52.6,60a8.34,8.34,0,0,1,1.6-2.1,3.14,3.14,0,0,1,4.4,0c1.7,1.4,1.7,3.2.4,4.9a26.63,26.63,0,0,0-4.4,17.8c.6,6.3,2.7,11.9,7.4,16.4,5.9,5.7,11.9,11.4,15.3,19.2,5.6,12.8,7.1,25.9,2.8,39.4a8.49,8.49,0,0,1-.9,2.2,3.49,3.49,0,0,1-6.4-2.8A33.1,33.1,0,0,0,75.6,142.2Z"/>
  <path d="M85.4,3.5c0,2.1-1.3,3.3-3.8,3.3a78,78,0,0,0-26.2,4.9C36.5,19.1,22.6,31.8,14,50.2c-.7,1.5-1.4,3.1-3.4,3.3-3,.3-4.9-2.5-3.3-5.4,3.4-6,6.5-12.4,10.8-17.7C34.2,10.5,55.4.6,81,0,84,.1,85.4,1.2,85.4,3.5Z"/>
  <path d="M112.7,140.4c-.2,3.6-.3,6.8-.5,10-.2,2.3-1.4,3.4-3.5,3.4s-3.1-1.3-3.2-3.6c-.3-7.8-.1-15.7-1-23.4-2.2-18.1-9.9-33.2-24.8-44.3-3-2.3-3.7-4.2-2.1-6.1s3.4-1.6,6.5.7c17,12.8,25.2,30.3,27.7,51C112.2,132.1,112.4,136.4,112.7,140.4Z"/>
  <path d="M118.2,47.3A13.07,13.07,0,0,1,121,49c16.1,16.9,27.9,36.3,33,59.3.6,2.7-.3,4.5-2.3,5s-3.8-.8-4.4-3.5c-4.7-20.9-15.3-38.6-29.6-54.2-.7-.8-1.7-1.4-2-2.3a6.15,6.15,0,0,1-.2-3.8C115.8,48.6,117.2,48.1,118.2,47.3Z"/>
  <path d="M53.3,140.8c-1.4,3.4-2.7,6.9-4.4,10.2-.9,1.8-2.8,2.2-4.6,1.1a3.28,3.28,0,0,1-1.4-4.4c0-.1.1-.1.1-.2a.35.35,0,0,1,.1-.2c4.4-6.3,2.2-11.8-2.2-16.9-4.1-4.7-8.5-9.1-12.5-13.9a49.08,49.08,0,0,1-10.6-22,12.25,12.25,0,0,1-.2-1.9,3.09,3.09,0,0,1,2.6-3.4h.1c1.9-.3,3.6.4,3.9,2.3,2.2,13.2,10.6,22.6,19.6,31.6,4.1,4.1,7.4,8.8,8.6,14.7a23.36,23.36,0,0,1,.4,2.6Z"/>
  <path d="M102,2.4c2.4.8,5.7,1.7,8.9,2.9a79.72,79.72,0,0,1,35.8,26.4c2.2,2.9,2.4,4.8.6,6.3s-3.9.8-6.1-2A73.8,73.8,0,0,0,101.6,9.6a12.09,12.09,0,0,1-1.8-.5,3.4,3.4,0,0,1-2.4-4C97.7,3.3,99.2,2.3,102,2.4Z"/>
  <path d="M0,79.8C1.1,72.9,2.2,66,3.4,59.1c.4-2.1,1.4-3.6,3.9-3.4s3.6,2.1,2.9,4.9A72.79,72.79,0,0,0,7.6,82.4a73.9,73.9,0,0,0,4.2,21.8,5.58,5.58,0,0,1-.4,4.2c-1.5,2.3-4.9,1.4-5.9-1.4A72.39,72.39,0,0,1,1,86.5C.8,84.3,1,82.2,1,80Z"/>
  <path d="M16.8,72.8A66.52,66.52,0,0,1,30.9,39a98.67,98.67,0,0,1,7-7.5c1.7-1.7,4-1.7,5.3-.3s1.2,3.7-.7,5.4A60.13,60.13,0,0,0,23.8,72.9c-.4,2.7-1.9,4.1-4,3.8A3.44,3.44,0,0,1,16.8,72.8Z"/>
  <path d="M67.3,139.1a35.49,35.49,0,0,1-3.1,14.4c-1.2,2.6-3,3.5-5.1,2.5s-2.4-2.7-1.3-5.3c4.6-11.3,3.5-21.5-5.5-30.4-1.8-1.8-1.9-3.8-.5-5.3s3.5-1.5,5.3.3A31.26,31.26,0,0,1,67.3,139.1Z"/>
  <path d="M15.9,116.1c1.2,1,2.4,1.6,3,2.5A77.83,77.83,0,0,0,35.8,137c1.9,1.5,2.2,3.6.9,5.2s-3.3,1.7-5.3.2a75.89,75.89,0,0,1-18.2-20.1,5.07,5.07,0,0,1-.2-4C13.2,117.4,14.6,116.9,15.9,116.1Z"/>
  <path d="M128.1,135.4c0,2.2.1,4.5,0,6.7a3.4,3.4,0,1,1-6.8,0v-.4A92.6,92.6,0,0,0,119,116c-.5-2.3.5-4,2.5-4.5a3.3,3.3,0,0,1,4.1,2.4c0,.2.1.3.1.5,1.2,6.9,2.2,13.8,3.3,20.8Z"/>
</svg>',
'tight_hand_shake'=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 245.99 157.79">
  <path d="M68.16,24.32c5.9,5.4,13,7,20.4,8,2.9.4,4.6-.1,6.6-2.5,1.8-2.2,4.8-3.7,7.6-4.6,8-2.8,16.4-3,24.8-3.7,13-1.1,25.5,1.2,37.9,4.3,4.4,1.1,8.7,1.3,13.1-.6-.6-1.1-1.1-2.1-1.7-3.2-2.5-4.6-1.4-8.8,2.9-11.5l14.7-9c4.6-2.8,8.9-1.7,11.5,3q17.85,31.5,35.5,63c1.2,2.1,2.4,4.2,3.5,6.3a7.75,7.75,0,0,1-2.7,10.5c-5.3,3.3-10.6,6.6-16,9.7-3.9,2.3-8.2,1.1-10.6-2.8-.9-1.6-1.8-3.2-2.8-4.8L200.16,98c3.8,11.4-1.1,18.6-14.2,20.3-3.6,10.3-5.2,11.8-15.2,13.4l-.6,2.2c-1.8,6.8-5.9,10.3-13,10.6a5.62,5.62,0,0,0-4.7,2.5c-6.3,8.3-14.8,9.6-24.3,7.5-5-1.1-10-2.6-15.1-3.9-6.9,11.7-21.2,7.9-25.5-3-10.6.1-14.2-2.1-17.9-10.9-11.5-1.2-15.6-4.9-16.9-15.5-13.1-5.1-16.6-13.3-9.9-24l-9.4-11.4c-1.1,1.9-2,3.5-3,5.1-2.6,4.4-6.9,5.6-11.2,3-5-3-10-6-14.9-9.1-4.4-2.7-5.6-6.9-3-11.5,10.1-18,20.2-36.1,30.4-54.1,2.8-4.9,5.5-9.8,8.3-14.6s7-5.8,11.5-3c4.8,2.9,9.6,5.8,14.3,8.7,4.9,3,6,7.1,3.2,12.2C68.76,23,68.46,23.72,68.16,24.32Zm78,118c-.8-.4-1.4-.8-2.1-1.1-6.6-3.2-13.3-6.3-19.8-9.7a5.65,5.65,0,0,1-2.7-3.5c-.6-3.3,2.8-5.1,6.1-3.5,7.8,3.7,15.5,7.5,23.3,11.3a11.63,11.63,0,0,0,8.2.6c2.5-.7,3.1-3,3.7-5.2s-1.4-2.3-2.5-2.9c-8.5-5-17.1-10-25.7-14.9-2-1.1-3.4-2.5-2.7-5,.8-2.8,3.5-3.6,6.4-1.9,9.2,5.3,18.4,10.6,27.6,16,2.9,1.7,5.7,1.4,8.5.5,2.5-.9,3.2-3.1,3.6-5.5s-1.3-2.8-2.7-3.7c-10.2-6.1-20.4-12.2-30.6-18.4-2.5-1.5-3.2-3.7-2-5.8s3.5-2.4,6.1-.9c1.2.7,2.3,1.4,3.5,2.1,10.3,6.1,20.5,12.3,30.8,18.5a7.1,7.1,0,0,0,8.8-.9,5.85,5.85,0,0,0,.5-7.9,19.21,19.21,0,0,0-2.9-2.8c-20.5-16.8-42.2-31.9-66-43.8-2.8-1.4-8.5-.1-10.5,2.5a44.49,44.49,0,0,1-14.6,13,26.69,26.69,0,0,1-15.9,3.3c-4.8-.6-7.4-3.7-7.5-8.4-.2-5.4,2.6-9.6,5.3-13.8,2.2-3.5,4.6-6.8,7.2-10.7-8.8-.6-16.5-3-23.3-8.6l-26.7,47.3,10.3,12.3c7.3-6.3,14.1-5.1,22.1,3.9,3.5-5.9,8.5-8.7,15.3-6.7,7.1,2.1,10.4,7.5,10.9,14.7,7.9,1.8,13.5,7.3,13,17.4,5.2,1.2,9.1,4.1,11.2,9.1s1.4,10-2.3,14.5c6.1,1.8,11.8,3.6,17.8,3.8,4.2.1,7.5-1.7,10.3-5.2ZM82.26,65a54.9,54.9,0,0,0,5.8-.3,25.14,25.14,0,0,0,16.3-10.6c3.6-5.1,8.2-7.5,13.8-8.8a1.85,1.85,0,0,0,.7-.2,6.07,6.07,0,0,1,5.7.5c24.6,12.2,47.1,27.5,68.4,44.9,1.2,1,2.1,1.1,3.1.2,4.4-3.7,8.7-7.4,13.1-11.1-9-16.1-17.8-31.7-26.8-47.5-7.9,3.6-15.6,2.3-23.4.3-9.2-2.4-18.6-4.1-28.2-3.2-8.5.8-16.9,1.9-25.4,3.1a6.92,6.92,0,0,0-4.4,2.4c-5.8,8.1-11.4,16.4-17,24.7C83.16,60.82,83,62.82,82.26,65ZM47.16,8c-13.1,23.3-26.1,46.4-39.2,69.6l15.6,9.7c13.1-23.3,26.1-46.4,39.2-69.6Zm136.2,9.5c13.1,23.3,26.1,46.5,39.2,69.7l15.7-9.6L199,8ZM68.06,128.92a28.32,28.32,0,0,0,2.8-2,19.52,19.52,0,0,0,1.7-2.3c4.8-6.4,9.6-12.7,14.4-19.1,2.1-2.8,1.4-6.6-1.8-9-2.8-2.1-5.5-1.7-7.8,1.4-5.1,6.9-10.1,13.8-15.2,20.6a5.61,5.61,0,0,0-.6,6.3C62.66,127,64.56,128.52,68.06,128.92Zm16.5,11a7.93,7.93,0,0,0,2.5-1.5q6.9-9,13.5-18.3c1.8-2.5.4-6.3-2.5-8.3s-5.3-1.5-7.4,1.3c-4.1,5.5-8.1,11.1-12.2,16.6A5.43,5.43,0,0,0,78,136a7,7,0,0,0,6.6,3.9Zm29-4.6c0-3.8-2.6-7.3-5.7-7.5a5.48,5.48,0,0,0-4.2,1.5c-2.9,3.5-5.6,7.2-8.2,10.9-1.7,2.5-.4,6.4,2.4,8.3s5.3,1.6,7.4-1.3c2.3-3.1,4.7-6.3,7-9.4a7.45,7.45,0,0,0,1.3-2.5Zm-50.1-33.1a7.24,7.24,0,0,0-5-7.3c-2.4-.8-3.9-.1-6,2.7a42.91,42.91,0,0,1-3.6,4.8c-3.2,3.3-.9,8.5,2.7,10.2,2.3,1,4.4.7,5.8-1.2,1.8-2.3,3.6-4.7,5.2-7.2A4,4,0,0,0,63.46,102.22Z"/>
</svg>',
                  );

                  $icons = array(
                    'one_way' => $svgs['one_way'],
                    'mutual' => $svgs['mutual'],
                    'company' => $svgs['company'],
                    'individual' => $svgs['individual'],
                    'partnership' => $svgs['mutual'],
                    'proprietary_limited_company' => $svgs['company'],
                    'sole_director_company' => $svgs['individual'],
                    '1_year' => $svgs['1_year'],
                    '2_years' => $svgs['2_years'],
                    '5_years' => $svgs['5_years'],
                    'indefinite' => $svgs['indefinite'],
                  );

                  foreach($icons as $label => $icon) {
                    if ($inputValue === $label) {
                      $radioSettings['#prefix'] = $radioSettings['#prefix'] . $icon;
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
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . $svgs['tight_finger_print'] . '<span>';
              }else if($formKey==='1_c_partnership'||$formKey==='2_c_partnership'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . $svgs['tight_hand_shake'] . '<span>';
              }else if($formKey==='1_a_ii_sole_director_company'||$formKey==='2_a_ii_sole_director_company'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . $svgs['tight_building'] . '<span>';
              }else if($formKey==='1_a_i_company'||$formKey==='2_a_i_company'){
                $formField['#title'] = '</span><span>' . $formField['#title'] . '</span>' . $svgs['tight_building'] . '<span>';
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
  $myfile = fopen($file, "r") or die("Unable to open file " . $file . "!");
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
  $js .= '
(function($){
  function linePadding(text){
    var charWidth = 30;
    if(text.length < charWidth){
      var str = \'\';
      for (var i = 1; i < charWidth - text.length; i += 1){
        str += \' \';
      }
      str += \'_\';
      return str;
    }
    return \'\';
  }
  $(window).load(function(){
    function loadFile(templateURL, callback) {
      JSZipUtils.getBinaryContent(templateURL, callback);
    };
   $(form_id).submit(function(event) {
      var formID = form_id,
        accumulatedData = {
          one_way_or_two_way: "",
          name_1: "", // 1. 1st party
          address_1: "",
          abn_or_acn_1: "",
          abn_acn_1: "",
          // email_1:"",
          sig_1st_1: "",
          sig_2nd_1: "",
          sig_3rd_1: "",
          name_2: "", // 2. 2nd party
          address_2:"",
          abn_or_acn_2: "",
          abn_acn_2: "",
          // email_2: "",
          sig_1st_2: "",
          sig_2nd_2: "",
          sig_3rd_2: "",
          permittedPurpose: "", // 3.
          durationOfObligations: "", // 4.
          jurisdiction: "", // 5.
          // signature blocks text, line by line
          sig1_intro_text: "",
          sig1_line_1_left:  \'______________________________\',
          sig1_1_left: \'\',
          sig1_line_1_right: \'______________________________\',
          sig1_1_right: \'\',
          sig1_line_2_left: \'______________________________\', // solid underline
          sig1_2_left: \'\',
          sig1_line_2_right: \'______________________________\',
          sig1_2_right: \'\',
          sig1_line_3_left: \'______________________________\',
          sig1_3_left: \'\',
          sig1_line_3_right: \'______________________________\',
          sig1_3_right: \'\',
          sig1_line_4_left: \'______________________________\',
          sig1_4_left: \'\',
          sig1_line_4_right: \'______________________________\',
          sig1_4_right: \'\',
          sig1_line_5_left: \'______________________________\',
          sig1_5_left: \'\',
          sig1_line_5_right: \'______________________________\',
          sig1_5_right: \'\',
          sig1_line_6_left: \'______________________________\',
          sig1_6_left: \'\',
          sig1_line_6_right: \'______________________________\',
          sig1_6_right: \'\',
          // then block 2
          sig2_intro_text: \'\',
          sig2_line_1_left: \'______________________________\',
          sig2_1_left: \'\',
          sig2_line_1_right: \'______________________________\',
          sig2_1_right: \'\',
          sig2_line_2_left: \'______________________________\',
          sig2_2_left: \'\',
          sig2_line_2_right: \'______________________________\',
          sig2_2_right: \'\',
          sig2_line_3_left: \'______________________________\',
          sig2_3_left: \'\',
          sig2_line_3_right: \'______________________________\',
          sig2_3_right: \'\',
          sig2_line_4_left: \'______________________________\',
          sig2_4_left: \'\',
          sig2_line_4_right: \'______________________________\',
          sig2_4_right: \'\',
          sig2_line_5_left: \'______________________________\',
          sig2_5_left: \'\',
          sig2_line_5_right: \'______________________________\',
          sig2_5_right: \'\',
          sig2_line_6_left: \'______________________________\',
          sig2_6_left: \'\',
          sig2_line_6_right: \'______________________________\',
          sig2_6_right: \'\'
        };

      // one way or two way -- values will be one_way, two_way
      accumulatedData.one_way_or_two_way = $("input[name=\'submitted[" + one_way_or_two_way_form_key + "]\']:checked").val();

      // 1st party


      if ($("input[name=\'submitted[" + edit_submitted_1_end_user_business_details_party_one + "]\']:checked").val() == \'individual\') {
        accumulatedData.name_1 = $(\'#\'+edit_submitted_1_individual_1_b_full_name, formID).val(); // changed below
        accumulatedData.address_1 = $(\'#\'+edit_submitted_1_individual_1_b_registered_business_address+\'\', formID).val();

        accumulatedData.abn_acn_1 = \'ABN \' + $(\'#\'+edit_submitted_1_individual_1_b_abn+\'\', formID).val(); // not ACN

        // accumulatedData.email_1 = $(\'#edit-submitted-1-individual-1-b-e-mail\', formID).val();
        accumulatedData.sig_1st_1 = $(\'#\'+edit_submitted_1_individual_1_b_full_name_of_individual+\'\', formID).val();
        accumulatedData.sig_2nd_1 = $(\'#\'+edit_submitted_1_individual_1_b_full_name_of_witness+\'\', formID).val();

        accumulatedData.sig1_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
          accumulatedData.sig_1st_1 +
          // \' ABN [\' +
          \' \' +
          accumulatedData.abn_acn_1 +
          \' trading as \' +
          accumulatedData.name_1;

        // then aggregate name for the title page & parties section
        accumulatedData.name_1 = accumulatedData.sig_1st_1 + \' trading as \' + accumulatedData.name_1;

        accumulatedData.sig1_1_left = \'Signature\'; // 1
        accumulatedData.sig1_1_right = \'Signature of Witness\';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = \'Name\';
        accumulatedData.sig1_line_2_right = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_2_right = \'Name of Witness\';
        accumulatedData.sig1_3_left = \'\'; // 2
        accumulatedData.sig1_3_right = \'\';
        accumulatedData.sig1_4_left = \'\';
        accumulatedData.sig1_4_right = \'\';
        accumulatedData.sig1_5_left = \'\'; // 3
        accumulatedData.sig1_5_right = \'\';
        accumulatedData.sig1_6_left = \'\';
        accumulatedData.sig1_6_right = \'\';

        //lines
        accumulatedData.sig1_line_3_left = \'\';
        accumulatedData.sig1_line_3_right = \'\';
        accumulatedData.sig1_line_4_left =  \'\';
        accumulatedData.sig1_line_4_right = \'\';
        accumulatedData.sig1_line_5_left = \'\';
        accumulatedData.sig1_line_5_right = \'\';
        accumulatedData.sig1_line_6_left = \'\';
        accumulatedData.sig1_line_6_right = \'\';
      } else if ($("input[name=\'submitted[" + edit_submitted_1_end_user_business_details_party_one + "]\']:checked").val() == \'partnership\') {
        accumulatedData.name_1 = $(\'#\'+edit_submitted_1_partnership_1_c_partnership_name, formID).val();
        accumulatedData.address_1 = $(\'#\'+edit_submitted_1_partnership_1_c_registered_business_address+\'\', formID).val();
        accumulatedData.abn_acn_1 = \'ABN \' +  $(\'#\'+edit_submitted_1_partnership_1_c_abn+\'\', formID).val(); // not ACN
        // accumulatedData.email_1 = $(\'#edit-submitted-1-partnership-1-c-e-mail\', formID).val();
        accumulatedData.sig_1st_1 = $(\'#\'+edit_submitted_1_partnership_1_c_full_name_of_partner_one+\'\', formID).val();
        accumulatedData.sig_2nd_1 = $(\'#\'+edit_submitted_1_partnership_1_c_full_name_of_partner_two+\'\', formID).val();
        accumulatedData.sig_3rd_1 = $(\'#\'+edit_submitted_1_partnership_1_c_full_name_of_partner_three+\'\', formID).val();

        accumulatedData.sig1_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
          accumulatedData.name_1 +
          // \' ABN [\' +
          \' \' +
          accumulatedData.abn_acn_1 +
          \' by its partners \' +
          accumulatedData.sig_1st_1 +
          (accumulatedData.sig_3rd_1.length > 0 ? \', \' : \', and \') +
          accumulatedData.sig_2nd_1 +
          (accumulatedData.sig_3rd_1.length > 0 ? (\', and \' +  accumulatedData.sig_3rd_1) : \'\');
        accumulatedData.sig1_1_left = \'Signature of Partner\'; // 1
        accumulatedData.sig1_1_right = \'Signature of Witness\';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = \'Name of Partner\';
        // accumulatedData.sig1_line_2_right =
        accumulatedData.sig1_2_right = \'Name of Witness\';
        accumulatedData.sig1_3_left = \'Signature of Partner\'; // 2
        accumulatedData.sig1_3_right = \'Signature of Witness\';
        accumulatedData.sig1_line_4_left = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_4_left = \'Name of Partner\';
        // accumulatedData.sig1_line_4_right =
        accumulatedData.sig1_4_right = \'Name of Witness (Please print)\';
        if(accumulatedData.sig_3rd_1.length > 0) {
          accumulatedData.sig1_5_left = \'Signature of Partner\'; // 3
          accumulatedData.sig1_5_right = \'Signature of Witness\';
          accumulatedData.sig1_line_6_left = accumulatedData.sig_3rd_1 + linePadding(accumulatedData.sig_3rd_1);
          accumulatedData.sig1_6_left = \'Name of Partner\';
          // accumulatedData.sig1_line_6_right =
          accumulatedData.sig1_6_right = \'Name of Witness (Please print)\';
        } else {
          accumulatedData.sig1_5_left = \'\'; // 3
          accumulatedData.sig1_5_right = \'\';
          accumulatedData.sig1_6_left = \'\';
          accumulatedData.sig1_6_right = \'\';
          // lines
          accumulatedData.sig1_line_5_left = \'\';
          accumulatedData.sig1_line_5_right = \'\';
          accumulatedData.sig1_line_6_left = \'\';
          accumulatedData.sig1_line_6_right = \'\';
        }
      } else if($("input[name=\'submitted[" + edit_submitted_1a_end_user_details_company + "]\']:checked").val() == \'proprietary_limited_company\') {
        accumulatedData.name_1 = $(\'#\'+edit_submitted_1_company_1_a_i_company_name+\'\', formID).val();
        accumulatedData.address_1 = $(\'#\'+edit_submitted_1_company_1_a_i_registered_business_address+\'\', formID).val();

        /*
        accumulatedData.abn_or_acn_1 = $("input[name=\'submitted[1_company][1_a_i_abn_or_acn]\']:checked").val();
        if(accumulatedData.abn_or_acn_1 == \'ABN\') {
          accumulatedData.abn_acn_1 = \'ABN \' + $(\'#edit-submitted-1-company-1-a-i-abn\', formID).val();
        } else {
          accumulatedData.abn_acn_1 = \'ACN \' + $(\'#edit-submitted-1-company-1-a-i-acn\', formID).val();
        }
        */
        accumulatedData.abn_or_acn_1 = \'ABN\';
        accumulatedData.abn_acn_1 = \'ABN \' + $(\'#\'+edit_submitted_1_company_1_a_i_abn+\'\', formID).val();


        // accumulatedData.email_1 = $(\'#edit-submitted-1-company-1-a-i-e-mail\', formID).val();
        accumulatedData.sig_1st_1 = $(\'#\'+edit_submitted_1_company_1_a_i_signatory_one_full_name_of_director+\'\', formID).val();
        accumulatedData.sig_2nd_1 = $(\'#\'+edit_submitted_1_company_1_a_i_signatory_two_full_name_of_director_company_secretary+\'\', formID).val();

        accumulatedData.sig1_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
        accumulatedData.name_1 +
        //  (accumulatedData.abn_or_acn_1 == \'ABN\' ? \' ABN [\' : \' ACN [\') +
        \' \' +
        accumulatedData.abn_acn_1 +
        \' in accordance with section 127(1) of the Corporations Act 2001\';

        accumulatedData.sig1_1_left =  \'Signature of Director\'; // 1
        accumulatedData.sig1_1_right = \'Signature of Director / Company Secretary (delete as applicable)\';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left =  \'Name of Director\';
        accumulatedData.sig1_line_2_right = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_2_right = \'Name of Director / Company Secretary (delete as applicable)\';
        accumulatedData.sig1_3_left = \'\'; // 2
        accumulatedData.sig1_3_right = \'\';
        accumulatedData.sig1_4_left = \'\';
        accumulatedData.sig1_4_right = \'\';
        accumulatedData.sig1_5_left = \'\'; // 3
        accumulatedData.sig1_5_right = \'\';
        accumulatedData.sig1_6_left = \'\';
        accumulatedData.sig1_6_right = \'\';

        //lines
        accumulatedData.sig1_line_3_left = \'\';
        accumulatedData.sig1_line_3_right = \'\';
        accumulatedData.sig1_line_4_left =  \'\';
        accumulatedData.sig1_line_4_right = \'\';
        accumulatedData.sig1_line_5_left = \'\';
        accumulatedData.sig1_line_5_right = \'\';
        accumulatedData.sig1_line_6_left = \'\';
        accumulatedData.sig1_line_6_right = \'\';
      } else if ($("input[name=\'submitted[" + edit_submitted_1a_end_user_details_company + "]\']:checked").val() == \'sole_director_company\') {
        accumulatedData.name_1 = $(\'#\'+edit_submitted_1_sole_director_company_1_a_ii_company_name+\'\', formID).val();
        accumulatedData.address_1 = $(\'#\'+edit_submitted_1_sole_director_company_1_a_ii_registered_business_address+\'\', formID).val();

        /*
        accumulatedData.abn_or_acn_1 = $("input[name=\'submitted[1_sole_director_company][1_a_ii_abn_or_acn]\']:checked").val();
        if(accumulatedData.abn_or_acn_1 == \'ABN\') {
          accumulatedData.abn_acn_1 = \'ABN \' + $(\'#edit-submitted-1-sole-director-company-1-a-ii-abn\', formID).val();
        } else {
          accumulatedData.abn_acn_1 = \'ACN \' + $(\'#edit-submitted-1-sole-director-company-1-a-ii-acn\', formID).val();
        }
        */
        accumulatedData.abn_or_acn_1 = \'ABN\';
        accumulatedData.abn_acn_1 = \'ABN \' + $(\'#\'+edit_submitted_1_sole_director_company_1_a_ii_abn+\'\', formID).val();

        // accumulatedData.email_1 = $(\'#edit-submitted-1-sole-director-company-1-a-ii-e-mail\', formID).val();
        accumulatedData.sig_1st_1 = $(\'#\'+edit_submitted_1_sole_director_company_1_a_ii_signatory_full_name_of_director+\'\', formID).val();
        accumulatedData.sig_2nd_1 = \'\';

        accumulatedData.sig1_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
          accumulatedData.name_1 +
          \' \' +
        //  (accumulatedData.abn_or_acn_1 == \'ABN\' ? \' ABN [\' : \' ACN [\') +
          accumulatedData.abn_acn_1 +
          \' in accordance with section 127(1) of the Corporations Act 2001\';

        accumulatedData.sig1_1_left = \'Signature of Sole Director\'; // 1
        accumulatedData.sig1_1_right = \'\';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = \'Name of Sole Director\';
        accumulatedData.sig1_2_right = \'\';
        accumulatedData.sig1_3_left = \'\'; // 2
        accumulatedData.sig1_3_right = \'\';
        accumulatedData.sig1_4_left = \'\';
        accumulatedData.sig1_4_right = \'\';
        accumulatedData.sig1_5_left = \'\'; // 3
        accumulatedData.sig1_5_right = \'\';
        accumulatedData.sig1_6_left = \'\';
        accumulatedData.sig1_6_right = \'\';

        //lines
        accumulatedData.sig1_line_1_right = \'\';
        accumulatedData.sig1_line_2_right = \'\';
        accumulatedData.sig1_line_3_left = \'\';
        accumulatedData.sig1_line_3_right = \'\';
        accumulatedData.sig1_line_4_left =  \'\';
        accumulatedData.sig1_line_4_right = \'\';
        accumulatedData.sig1_line_5_left = \'\';
        accumulatedData.sig1_line_5_right = \'\';
        accumulatedData.sig1_line_6_left = \'\';
        accumulatedData.sig1_line_6_right = \'\';

        //and text around for this, & above - blank
      }

      // 2nd party

      if ($("input[name=\'submitted[" + edit_submitted_2_end_user_business_details_party_two + "]\']:checked").val() == \'individual\') {
        accumulatedData.name_2 = $(\'#\'+edit_submitted_2_individual_2_b_full_name, formID).val(); // changed below
        accumulatedData.address_2 = $(\'#\'+edit_submitted_2_individual_2_b_registered_business_address+\'\', formID).val();

        accumulatedData.abn_acn_2 = \'ABN \' + $(\'#\'+edit_submitted_2_individual_2_b_abn+\'\', formID).val(); // not acn

        // accumulatedData.email_2 = $(\'#edit-submitted-2-individual-2-b-e-mail\', formID).val();
        accumulatedData.sig_1st_2 = $(\'#\'+edit_submitted_2_individual_2_b_full_name_of_individual+\'\', formID).val();
        accumulatedData.sig_2nd_2 = $(\'#\'+edit_submitted_2_individual_2_b_full_name_of_witness+\'\', formID).val();

        accumulatedData.sig2_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
          accumulatedData.sig_1st_2 +
          // \' ABN [\' +
          \' \' +
          accumulatedData.abn_acn_2 +
          \' trading as \' +
          accumulatedData.name_2;

        // then aggregate name for the title page & parties section
        accumulatedData.name_2 = accumulatedData.sig_1st_2 + \' trading as \' + accumulatedData.name_2;

        accumulatedData.sig2_1_left = \'Signature\'; // 1
        accumulatedData.sig2_1_right = \'Signature of Witness\';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = \'Name\';
        accumulatedData.sig2_line_2_right = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_2_right = \'Name of Witness\';
        accumulatedData.sig2_3_left = \'\'; // 2
        accumulatedData.sig2_3_right = \'\';
        accumulatedData.sig2_4_left = \'\';
        accumulatedData.sig2_4_right = \'\';
        accumulatedData.sig2_5_left = \'\'; // 3
        accumulatedData.sig2_5_right = \'\';
        accumulatedData.sig2_6_left = \'\';
        accumulatedData.sig2_6_right = \'\';

        //lines
        accumulatedData.sig2_line_3_left = \'\';
        accumulatedData.sig2_line_3_right = \'\';
        accumulatedData.sig2_line_4_left =  \'\';
        accumulatedData.sig2_line_4_right = \'\';
        accumulatedData.sig2_line_5_left = \'\';
        accumulatedData.sig2_line_5_right = \'\';
        accumulatedData.sig2_line_6_left = \'\';
        accumulatedData.sig2_line_6_right = \'\';
      } else if ($("input[name=\'submitted[" + edit_submitted_2_end_user_business_details_party_two + "]\']:checked").val() == \'partnership\') {
        accumulatedData.name_2 = $(\'#\' + edit_submitted_2_partnership_2_c_partnership_name, formID).val();
        accumulatedData.address_2 = $(\'#\' + edit_submitted_2_partnership_2_c_registered_business_address + \'\', formID).val();
        accumulatedData.abn_acn_2 = \'ABN \' + $(\'#\' + edit_submitted_2_partnership_2_c_abn + \'\', formID).val(); // not acn
        // accumulatedData.email_2 = $(\'#edit-submitted-2-partnership-2-c-e-mail\', formID).val();
        accumulatedData.sig_1st_2 = $(\'#\' + edit_submitted_2_partnership_2_c_full_name_of_partner_one + \'\', formID).val();
        accumulatedData.sig_2nd_2 = $(\'#\'+ edit_submitted_2_partnership_2_c_full_name_of_partner_two+\'\', formID).val();
        accumulatedData.sig_3rd_2 = $(\'#\'+ edit_submitted_2_partnership_2_c_full_name_of_partner_three +\'\', formID).val();

        accumulatedData.sig2_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
          accumulatedData.name_2 +
          \' \' +
          // \' ABN [\' +
          accumulatedData.abn_acn_2 +
          \' by its partners \' +
          accumulatedData.sig_1st_2 +
          (accumulatedData.sig_3rd_2.length > 0 ? \', \' : \', and \') +
          accumulatedData.sig_2nd_2 +
          (accumulatedData.sig_3rd_2.length > 0 ? (\', and \' +  accumulatedData.sig_3rd_2) : \'\');
        accumulatedData.sig2_1_left = \'Signature of Partner\'; // 1
        accumulatedData.sig2_1_right = \'Signature of Witness\';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = \'Name of Partner\';
        // accumulatedData.sig2_line_2_right =
        accumulatedData.sig2_2_right = \'Name of Witness (Please print)\';

        accumulatedData.sig2_3_left = \'Signature of Partner\'; // 2
        accumulatedData.sig2_3_right = \'Signature of Witness\';
        accumulatedData.sig2_line_4_left = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_4_left = \'Name of Partner\';
        // accumulatedData.sig2_line_4_right =
        accumulatedData.sig2_4_right = \'Name of Witness\';
        if(accumulatedData.sig_3rd_2.length > 0) {

          accumulatedData.sig2_5_left = \'Signature of Partner\'; // 3
          accumulatedData.sig2_5_right = \'Signature of Witness\';
          accumulatedData.sig2_line_6_left = accumulatedData.sig_3rd_2 + linePadding(accumulatedData.sig_3rd_2);
          accumulatedData.sig2_6_left = \'Name of Partner\';
          // accumulatedData.sig2_line_6_right =
          accumulatedData.sig2_6_right = \'Name of Witness\';
        } else {
          accumulatedData.sig2_5_left = \'\'; // 3
          accumulatedData.sig2_5_right = \'\';
          accumulatedData.sig2_6_left = \'\';
          accumulatedData.sig2_6_right = \'\';
          // lines
          accumulatedData.sig2_line_5_left = \'\';
          accumulatedData.sig2_line_5_right = \'\';
          accumulatedData.sig2_line_6_left = \'\';
          accumulatedData.sig2_line_6_right = \'\';
        }
      }else if($("input[name=\'submitted[" + edit_submitted_2a_other_party_details_company + "]\']:checked").val() == \'proprietary_limited_company\') {
        accumulatedData.name_2 = $(\'#\'+edit_submitted_2_company_2_a_i_company_name+\'\', formID).val();
        accumulatedData.address_2 = $(\'#\'+edit_submitted_2_company_2_a_i_registered_business_address+\'\', formID).val();

        /*
        accumulatedData.abn_or_acn_2 = $("input[name=\'submitted[2_company][2_a_i_abn_or_acn]\']:checked").val();
        if(accumulatedData.abn_or_acn_2 == \'ABN\') {
          accumulatedData.abn_acn_2 = \'ABN \' + $(\'#edit-submitted-2-company-2-a-i-abn\', formID).val();
        } else {
          accumulatedData.abn_acn_2 = \'ACN \' + $(\'#edit-submitted-2-company-2-a-i-acn\', formID).val();
        }
        */
        accumulatedData.abn_or_acn_2 = \'ABN\';
        accumulatedData.abn_acn_2 = \'ABN \' + $(\'#\'+edit_submitted_2_company_2_a_i_abn+\'\', formID).val();

        // accumulatedData.email_2 = $(\'#edit-submitted-2-company-2-a-i-e-mail\', formID).val();
        accumulatedData.sig_1st_2 = $(\'#\'+edit_submitted_2_company_2_a_i_signatory_one_full_name_of_director+\'\', formID).val();
        accumulatedData.sig_2nd_2 = $(\'#\'+edit_submitted_2_company_2_a_i_signatory_two_full_name_of_director_company_secretary+\'\', formID).val();

        accumulatedData.sig2_intro_text = \'SIGNED SEALED AND DELIVERED by \' +
        accumulatedData.name_2 +
        // (accumulatedData.abn_or_acn_2 == \'ABN\' ? \' ABN [\' : \' ACN [\') +
        \' \' +
        accumulatedData.abn_acn_2 +
        \' in accordance with section 127(1) of the Corporations Act 2001\';

        accumulatedData.sig2_1_left =  "Signature of Director"; // 1
        accumulatedData.sig2_1_right = "Signature of Director / Company Secretary (delete as applicable)";
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left =  "Name of Director";
        accumulatedData.sig2_line_2_right = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_2_right = "Name of Director / Company Secretary (delete as applicable)";
        accumulatedData.sig2_3_left = ""; // 2
        accumulatedData.sig2_3_right = "";
        accumulatedData.sig2_4_left = "";
        accumulatedData.sig2_4_right = "";
        accumulatedData.sig2_5_left = ""; // 3
        accumulatedData.sig2_5_right = "";
        accumulatedData.sig2_6_left = "";
        accumulatedData.sig2_6_right = "";

        //lines
        accumulatedData.sig2_line_3_left = "";
        accumulatedData.sig2_line_3_right = "";
        accumulatedData.sig2_line_4_left =  "";
        accumulatedData.sig2_line_4_right = "";
        accumulatedData.sig2_line_5_left = "";
        accumulatedData.sig2_line_5_right = "";
        accumulatedData.sig2_line_6_left = "";
        accumulatedData.sig2_line_6_right = "";
      } else if ($("input[name=\'submitted[" + edit_submitted_2a_other_party_details_company + "]\']:checked").val() == \'sole_director_company\') {
        accumulatedData.name_2 = $("#"+edit_submitted_2_sole_director_company_2_a_ii_company_name+"", formID).val();
        accumulatedData.address_2 = $("#"+edit_submitted_2_sole_director_company_2_a_ii_registered_business_address+"", formID).val();

        /*
        accumulatedData.abn_or_acn_2 = $("input[name=\'submitted[2_sole_director_company][2_a_ii_abn_or_acn]\']:checked").val();
        if(accumulatedData.abn_or_acn_2 == \'ABN\') {
          accumulatedData.abn_acn_2 = \'ABN \' +  $(\'#edit-submitted-2-sole-director-company-2-a-ii-abn\', formID).val();
        } else {
          accumulatedData.abn_acn_2 = \'ACN \' +  $(\'#edit-submitted-2-sole-director-company-2-a-ii-acn\', formID).val();
        }
        */
        accumulatedData.abn_or_acn_2 = "ABN";
        accumulatedData.abn_acn_2 = "ACN " +  $("#"+edit_submitted_2_sole_director_company_2_a_ii_abn+"", formID).val();

        // accumulatedData.email_2 = $(\'#edit-submitted-2-sole-director-company-2-a-ii-e-mail\', formID).val();
        accumulatedData.sig_1st_2 = $("#"+edit_submitted_2_sole_director_company_2_a_ii_signatory_full_name_of_director+"", formID).val();
        accumulatedData.sig_2nd_2 = "";

        accumulatedData.sig2_intro_text = "SIGNED SEALED AND DELIVERED by " +
          accumulatedData.name_2 +
          // (accumulatedData.abn_or_acn_2 == \'ABN\' ? \' ABN [\' : \' ACN [\') +
          " " +
          accumulatedData.abn_acn_2 +
          " in accordance with section 127(1) of the Corporations Act 2001";

        accumulatedData.sig2_1_left = "Signature of Sole Director"; // 1
        accumulatedData.sig2_2_right = "";
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = "Name of Sole Director";
        accumulatedData.sig2_2_right = "";
        accumulatedData.sig2_3_left = ""; // 2
        accumulatedData.sig2_3_right = "";
        accumulatedData.sig2_4_left = "";
        accumulatedData.sig2_4_right = "";
        accumulatedData.sig2_5_left = ""; // 3
        accumulatedData.sig2_5_right ="";
        accumulatedData.sig2_6_left = "";
        accumulatedData.sig2_6_right = "";

        //lines
        accumulatedData.sig2_line_1_right = "";
        accumulatedData.sig2_line_2_right = "";
        accumulatedData.sig2_line_3_left = "";
        accumulatedData.sig2_line_3_right = "";
        accumulatedData.sig2_line_4_left =  "";
        accumulatedData.sig2_line_4_right = "";
        accumulatedData.sig2_line_5_left = "";
        accumulatedData.sig2_line_5_right = "";
        accumulatedData.sig2_line_6_left = "";
        accumulatedData.sig2_line_6_right = "";
      }

      // 3
      accumulatedData.permittedPurpose = $("#" + edit_submitted_3_permitted_purpose + "", formID).val();
      // 4
      accumulatedData.durationOfObligations = $("input[name=\'submitted[" + edit_submitted_4_duration_of_obligations + "]\']:checked").val().replace(/_/g, \' \');
      // 5
      accumulatedData.jurisdiction =$("input[name=\'submitted[" + edit_submitted_5_law_and_jurisdiction + "]\']:checked").val(); //$(\'#\' + element_name + \' option:selected\', formID).text();

      // add start & end tags for the xml
      /*
      for (var prop in accumulatedData) {
        if (accumulatedData.hasOwnProperty(prop)) {
          accumulatedData[prop] = \'<w:p><w:r><w:t>\' + accumulatedData[prop] + \'</w:t></w:r></w:p>\';
        }
      }
      */
      // end xml
      // generate the file
      var templateFilePath = "";
      if(accumulatedData.one_way_or_two_way == "one_way") {
        templateFilePath = "/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/template-one.docx"
      } else {
        templateFilePath = "/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/template-two.docx"
      }

      loadFile(templateFilePath, function(error, template) {
        if (error) { throw error };
        var zip = new JSZip(template);
        var doc = new Docxtemplater().loadZip(zip)
        doc.setData(accumulatedData);

        try {
            doc.render()
        }
        catch (error) {alert();
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));

            // multi err
            e.properties.errors.forEach(function(err) {
                console.log(err);
            });
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            alert();
            throw error;
        }

        var out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }) // Output the document using Data-URI
        saveAs(out, "contract.docx")
      }); // end LoadFile fn
    }); // end form submit

  }); // end load
})(jQuery);
';
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
