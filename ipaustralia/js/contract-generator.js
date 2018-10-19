
(function($){
  function linePadding(text){
    var charWidth = 30;
    if(text.length < charWidth){
      var str = '';
      for (var i = 1; i < charWidth - text.length; i += 1){
        str += ' ';
      }
      str += '_';
      return str;
    }
    return '';
  }
  $(window).load(function(){
    function loadFile(templateURL, callback) {
      JSZipUtils.getBinaryContent(templateURL, callback);
    };
   $(form_id).submit(function(event) {
      var formID = form_id,
        accumulatedData = {
          one_way_or_two_way: '',
          name_1: '', // 1. 1st party
          address_1: '',
          abn_or_acn_1: '',
          abn_acn_1: '',
          // email_1: '',
          sig_1st_1: '',
          sig_2nd_1: '',
          sig_3rd_1: '',
          name_2: '', // 2. 2nd party
          address_2: '',
          abn_or_acn_2: '',
          abn_acn_2: '',
          // email_2: '',
          sig_1st_2: '',
          sig_2nd_2: '',
          sig_3rd_2: '',
          permittedPurpose: '', // 3.
          durationOfObligations: '', // 4.
          jurisdiction: '', // 5.
          // signature blocks text, line by line
          sig1_intro_text: '',
          sig1_line_1_left:  '______________________________',
          sig1_1_left: '',
          sig1_line_1_right: '______________________________',
          sig1_1_right: '',
          sig1_line_2_left: '______________________________', // solid underline
          sig1_2_left: '',
          sig1_line_2_right: '______________________________',
          sig1_2_right: '',
          sig1_line_3_left: '______________________________',
          sig1_3_left: '',
          sig1_line_3_right: '______________________________',
          sig1_3_right: '',
          sig1_line_4_left: '______________________________',
          sig1_4_left: '',
          sig1_line_4_right: '______________________________',
          sig1_4_right: '',
          sig1_line_5_left: '______________________________',
          sig1_5_left: '',
          sig1_line_5_right: '______________________________',
          sig1_5_right: '',
          sig1_line_6_left: '______________________________',
          sig1_6_left: '',
          sig1_line_6_right: '______________________________',
          sig1_6_right: '',
          // then block 2
          sig2_intro_text: '',
          sig2_line_1_left: '______________________________',
          sig2_1_left: '',
          sig2_line_1_right: '______________________________',
          sig2_1_right: '',
          sig2_line_2_left: '______________________________',
          sig2_2_left: '',
          sig2_line_2_right: '______________________________',
          sig2_2_right: '',
          sig2_line_3_left: '______________________________',
          sig2_3_left: '',
          sig2_line_3_right: '______________________________',
          sig2_3_right: '',
          sig2_line_4_left: '______________________________',
          sig2_4_left: '',
          sig2_line_4_right: '______________________________',
          sig2_4_right: '',
          sig2_line_5_left: '______________________________',
          sig2_5_left: '',
          sig2_line_5_right: '______________________________',
          sig2_5_right: '',
          sig2_line_6_left: '______________________________',
          sig2_6_left: '',
          sig2_line_6_right: '______________________________',
          sig2_6_right: ''
        };

      // one way or two way -- values will be one_way, two_way
      accumulatedData.one_way_or_two_way = $("input[name='submitted[" + one_way_or_two_way_form_key + "]']:checked").val();

      // 1st party


      if ($("input[name='submitted[" + edit_submitted_1_end_user_business_details_party_one + "]']:checked").val() == 'individual') {
        accumulatedData.name_1 = $('#'+edit_submitted_1_individual_1_b_full_name, formID).val(); // changed below
        accumulatedData.address_1 = $('#'+edit_submitted_1_individual_1_b_registered_business_address+'', formID).val();

        accumulatedData.abn_acn_1 = 'ABN ' + $('#'+edit_submitted_1_individual_1_b_abn+'', formID).val(); // not ACN

        // accumulatedData.email_1 = $('#edit-submitted-1-individual-1-b-e-mail', formID).val();
        accumulatedData.sig_1st_1 = $('#'+edit_submitted_1_individual_1_b_full_name_of_individual+'', formID).val();
        accumulatedData.sig_2nd_1 = $('#'+edit_submitted_1_individual_1_b_full_name_of_witness+'', formID).val();

        accumulatedData.sig1_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.sig_1st_1 +
          // ' ABN [' +
          ' ' +
          accumulatedData.abn_acn_1 +
          ' trading as ' +
          accumulatedData.name_1;

        // then aggregate name for the title page & parties section
        accumulatedData.name_1 = accumulatedData.sig_1st_1 + ' trading as ' + accumulatedData.name_1;

        accumulatedData.sig1_1_left = 'Signature'; // 1
        accumulatedData.sig1_1_right = 'Signature of Witness';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = 'Name';
        accumulatedData.sig1_line_2_right = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_2_right = 'Name of Witness';
        accumulatedData.sig1_3_left = ''; // 2
        accumulatedData.sig1_3_right = '';
        accumulatedData.sig1_4_left = '';
        accumulatedData.sig1_4_right = '';
        accumulatedData.sig1_5_left = ''; // 3
        accumulatedData.sig1_5_right = '';
        accumulatedData.sig1_6_left = '';
        accumulatedData.sig1_6_right = '';

        //lines
        accumulatedData.sig1_line_3_left = '';
        accumulatedData.sig1_line_3_right = '';
        accumulatedData.sig1_line_4_left =  '';
        accumulatedData.sig1_line_4_right = '';
        accumulatedData.sig1_line_5_left = '';
        accumulatedData.sig1_line_5_right = '';
        accumulatedData.sig1_line_6_left = '';
        accumulatedData.sig1_line_6_right = '';
      } else if ($("input[name='submitted[" + edit_submitted_1_end_user_business_details_party_one + "]']:checked").val() == 'partnership') {
        accumulatedData.name_1 = $('#'+edit_submitted_1_partnership_1_c_partnership_name, formID).val();
        accumulatedData.address_1 = $('#'+edit_submitted_1_partnership_1_c_registered_business_address+'', formID).val();
        accumulatedData.abn_acn_1 = 'ABN ' +  $('#'+edit_submitted_1_partnership_1_c_abn+'', formID).val(); // not ACN
        // accumulatedData.email_1 = $('#edit-submitted-1-partnership-1-c-e-mail', formID).val();
        accumulatedData.sig_1st_1 = $('#'+edit_submitted_1_partnership_1_c_full_name_of_partner_one+'', formID).val();
        accumulatedData.sig_2nd_1 = $('#'+edit_submitted_1_partnership_1_c_full_name_of_partner_two+'', formID).val();
        accumulatedData.sig_3rd_1 = $('#'+edit_submitted_1_partnership_1_c_full_name_of_partner_three+'', formID).val();

        accumulatedData.sig1_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.name_1 +
          // ' ABN [' +
          ' ' +
          accumulatedData.abn_acn_1 +
          ' by its partners ' +
          accumulatedData.sig_1st_1 +
          (accumulatedData.sig_3rd_1.length > 0 ? ', ' : ', and ') +
          accumulatedData.sig_2nd_1 +
          (accumulatedData.sig_3rd_1.length > 0 ? (', and ' +  accumulatedData.sig_3rd_1) : '');
        accumulatedData.sig1_1_left = 'Signature of Partner'; // 1
        accumulatedData.sig1_1_right = 'Signature of Witness';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = 'Name of Partner';
        // accumulatedData.sig1_line_2_right =
        accumulatedData.sig1_2_right = 'Name of Witness';
        accumulatedData.sig1_3_left = 'Signature of Partner'; // 2
        accumulatedData.sig1_3_right = 'Signature of Witness';
        accumulatedData.sig1_line_4_left = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_4_left = 'Name of Partner';
        // accumulatedData.sig1_line_4_right =
        accumulatedData.sig1_4_right = 'Name of Witness (Please print)';
        if(accumulatedData.sig_3rd_1.length > 0) {
          accumulatedData.sig1_5_left = 'Signature of Partner'; // 3
          accumulatedData.sig1_5_right = 'Signature of Witness';
          accumulatedData.sig1_line_6_left = accumulatedData.sig_3rd_1 + linePadding(accumulatedData.sig_3rd_1);
          accumulatedData.sig1_6_left = 'Name of Partner';
          // accumulatedData.sig1_line_6_right =
          accumulatedData.sig1_6_right = 'Name of Witness (Please print)';
        } else {
          accumulatedData.sig1_5_left = ''; // 3
          accumulatedData.sig1_5_right = '';
          accumulatedData.sig1_6_left = '';
          accumulatedData.sig1_6_right = '';
          // lines
          accumulatedData.sig1_line_5_left = '';
          accumulatedData.sig1_line_5_right = '';
          accumulatedData.sig1_line_6_left = '';
          accumulatedData.sig1_line_6_right = '';
        }
      } else if($("input[name='submitted[" + edit_submitted_1a_end_user_details_company + "]']:checked").val() == 'proprietary_limited_company') {
        accumulatedData.name_1 = $('#'+edit_submitted_1_company_1_a_i_company_name+'', formID).val();
        accumulatedData.address_1 = $('#'+edit_submitted_1_company_1_a_i_registered_business_address+'', formID).val();

        /*
        accumulatedData.abn_or_acn_1 = $("input[name='submitted[1_company][1_a_i_abn_or_acn]']:checked").val();
        if(accumulatedData.abn_or_acn_1 == 'ABN') {
          accumulatedData.abn_acn_1 = 'ABN ' + $('#edit-submitted-1-company-1-a-i-abn', formID).val();
        } else {
          accumulatedData.abn_acn_1 = 'ACN ' + $('#edit-submitted-1-company-1-a-i-acn', formID).val();
        }
        */
        accumulatedData.abn_or_acn_1 = 'ABN';
        accumulatedData.abn_acn_1 = 'ABN ' + $('#'+edit_submitted_1_company_1_a_i_abn+'', formID).val();


        // accumulatedData.email_1 = $('#edit-submitted-1-company-1-a-i-e-mail', formID).val();
        accumulatedData.sig_1st_1 = $('#'+edit_submitted_1_company_1_a_i_signatory_one_full_name_of_director+'', formID).val();
        accumulatedData.sig_2nd_1 = $('#'+edit_submitted_1_company_1_a_i_signatory_two_full_name_of_director_company_secretary+'', formID).val();

        accumulatedData.sig1_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
        accumulatedData.name_1 +
        //  (accumulatedData.abn_or_acn_1 == 'ABN' ? ' ABN [' : ' ACN [') +
        ' ' +
        accumulatedData.abn_acn_1 +
        ' in accordance with section 127(1) of the Corporations Act 2001';

        accumulatedData.sig1_1_left =  'Signature of Director'; // 1
        accumulatedData.sig1_1_right = 'Signature of Director / Company Secretary (delete as applicable)';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left =  'Name of Director';
        accumulatedData.sig1_line_2_right = accumulatedData.sig_2nd_1 + linePadding(accumulatedData.sig_2nd_1);
        accumulatedData.sig1_2_right = 'Name of Director / Company Secretary (delete as applicable)';
        accumulatedData.sig1_3_left = ''; // 2
        accumulatedData.sig1_3_right = '';
        accumulatedData.sig1_4_left = '';
        accumulatedData.sig1_4_right = '';
        accumulatedData.sig1_5_left = ''; // 3
        accumulatedData.sig1_5_right = '';
        accumulatedData.sig1_6_left = '';
        accumulatedData.sig1_6_right = '';

        //lines
        accumulatedData.sig1_line_3_left = '';
        accumulatedData.sig1_line_3_right = '';
        accumulatedData.sig1_line_4_left =  '';
        accumulatedData.sig1_line_4_right = '';
        accumulatedData.sig1_line_5_left = '';
        accumulatedData.sig1_line_5_right = '';
        accumulatedData.sig1_line_6_left = '';
        accumulatedData.sig1_line_6_right = '';
      } else if ($("input[name='submitted[" + edit_submitted_1a_end_user_details_company + "]']:checked").val() == 'sole_director_company') {
        accumulatedData.name_1 = $('#'+edit_submitted_1_sole_director_company_1_a_ii_company_name+'', formID).val();
        accumulatedData.address_1 = $('#'+edit_submitted_1_sole_director_company_1_a_ii_registered_business_address+'', formID).val();

        /*
        accumulatedData.abn_or_acn_1 = $("input[name='submitted[1_sole_director_company][1_a_ii_abn_or_acn]']:checked").val();
        if(accumulatedData.abn_or_acn_1 == 'ABN') {
          accumulatedData.abn_acn_1 = 'ABN ' + $('#edit-submitted-1-sole-director-company-1-a-ii-abn', formID).val();
        } else {
          accumulatedData.abn_acn_1 = 'ACN ' + $('#edit-submitted-1-sole-director-company-1-a-ii-acn', formID).val();
        }
        */
        accumulatedData.abn_or_acn_1 = 'ABN';
        accumulatedData.abn_acn_1 = 'ABN ' + $('#'+edit_submitted_1_sole_director_company_1_a_ii_abn+'', formID).val();

        // accumulatedData.email_1 = $('#edit-submitted-1-sole-director-company-1-a-ii-e-mail', formID).val();
        accumulatedData.sig_1st_1 = $('#'+edit_submitted_1_sole_director_company_1_a_ii_signatory_full_name_of_director+'', formID).val();
        accumulatedData.sig_2nd_1 = '';

        accumulatedData.sig1_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.name_1 +
          ' ' +
        //  (accumulatedData.abn_or_acn_1 == 'ABN' ? ' ABN [' : ' ACN [') +
          accumulatedData.abn_acn_1 +
          ' in accordance with section 127(1) of the Corporations Act 2001';

        accumulatedData.sig1_1_left = 'Signature of Sole Director'; // 1
        accumulatedData.sig1_1_right = '';
        accumulatedData.sig1_line_2_left = accumulatedData.sig_1st_1 + linePadding(accumulatedData.sig_1st_1);
        accumulatedData.sig1_2_left = 'Name of Sole Director';
        accumulatedData.sig1_2_right = '';
        accumulatedData.sig1_3_left = ''; // 2
        accumulatedData.sig1_3_right = '';
        accumulatedData.sig1_4_left = '';
        accumulatedData.sig1_4_right = '';
        accumulatedData.sig1_5_left = ''; // 3
        accumulatedData.sig1_5_right = '';
        accumulatedData.sig1_6_left = '';
        accumulatedData.sig1_6_right = '';

        //lines
        accumulatedData.sig1_line_1_right = '';
        accumulatedData.sig1_line_2_right = '';
        accumulatedData.sig1_line_3_left = '';
        accumulatedData.sig1_line_3_right = '';
        accumulatedData.sig1_line_4_left =  '';
        accumulatedData.sig1_line_4_right = '';
        accumulatedData.sig1_line_5_left = '';
        accumulatedData.sig1_line_5_right = '';
        accumulatedData.sig1_line_6_left = '';
        accumulatedData.sig1_line_6_right = '';

        //and text around for this, & above - blank
      }

      // 2nd party

      if ($("input[name='submitted[" + edit_submitted_2_end_user_business_details_party_two + "]']:checked").val() == 'individual') {
        accumulatedData.name_2 = $('#'+edit_submitted_2_individual_2_b_full_name, formID).val(); // changed below
        accumulatedData.address_2 = $('#'+edit_submitted_2_individual_2_b_registered_business_address+'', formID).val();

        accumulatedData.abn_acn_2 = 'ABN ' + $('#'+edit_submitted_2_individual_2_b_abn+'', formID).val(); // not acn

        // accumulatedData.email_2 = $('#edit-submitted-2-individual-2-b-e-mail', formID).val();
        accumulatedData.sig_1st_2 = $('#'+edit_submitted_2_individual_2_b_full_name_of_individual+'', formID).val();
        accumulatedData.sig_2nd_2 = $('#'+edit_submitted_2_individual_2_b_full_name_of_witness+'', formID).val();

        accumulatedData.sig2_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.sig_1st_2 +
          // ' ABN [' +
          ' ' +
          accumulatedData.abn_acn_2 +
          ' trading as ' +
          accumulatedData.name_2;

        // then aggregate name for the title page & parties section
        accumulatedData.name_2 = accumulatedData.sig_1st_2 + ' trading as ' + accumulatedData.name_2;

        accumulatedData.sig2_1_left = 'Signature'; // 1
        accumulatedData.sig2_1_right = 'Signature of Witness';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = 'Name';
        accumulatedData.sig2_line_2_right = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_2_right = 'Name of Witness';
        accumulatedData.sig2_3_left = ''; // 2
        accumulatedData.sig2_3_right = '';
        accumulatedData.sig2_4_left = '';
        accumulatedData.sig2_4_right = '';
        accumulatedData.sig2_5_left = ''; // 3
        accumulatedData.sig2_5_right = '';
        accumulatedData.sig2_6_left = '';
        accumulatedData.sig2_6_right = '';

        //lines
        accumulatedData.sig2_line_3_left = '';
        accumulatedData.sig2_line_3_right = '';
        accumulatedData.sig2_line_4_left =  '';
        accumulatedData.sig2_line_4_right = '';
        accumulatedData.sig2_line_5_left = '';
        accumulatedData.sig2_line_5_right = '';
        accumulatedData.sig2_line_6_left = '';
        accumulatedData.sig2_line_6_right = '';
      } else if ($("input[name='submitted[" + edit_submitted_2_end_user_business_details_party_two + "]']:checked").val() == 'partnership') {
        accumulatedData.name_2 = $('#' + edit_submitted_2_partnership_2_c_partnership_name, formID).val();
        accumulatedData.address_2 = $('#' + edit_submitted_2_partnership_2_c_registered_business_address + '', formID).val();
        accumulatedData.abn_acn_2 = 'ABN ' + $('#' + edit_submitted_2_partnership_2_c_abn + '', formID).val(); // not acn
        // accumulatedData.email_2 = $('#edit-submitted-2-partnership-2-c-e-mail', formID).val();
        accumulatedData.sig_1st_2 = $('#' + edit_submitted_2_partnership_2_c_full_name_of_partner_one + '', formID).val();
        accumulatedData.sig_2nd_2 = $('#'+ edit_submitted_2_partnership_2_c_full_name_of_partner_two+'', formID).val();
        accumulatedData.sig_3rd_2 = $('#'+ edit_submitted_2_partnership_2_c_full_name_of_partner_three +'', formID).val();

        accumulatedData.sig2_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.name_2 +
          ' ' +
          // ' ABN [' +
          accumulatedData.abn_acn_2 +
          ' by its partners ' +
          accumulatedData.sig_1st_2 +
          (accumulatedData.sig_3rd_2.length > 0 ? ', ' : ', and ') +
          accumulatedData.sig_2nd_2 +
          (accumulatedData.sig_3rd_2.length > 0 ? (', and ' +  accumulatedData.sig_3rd_2) : '');
        accumulatedData.sig2_1_left = 'Signature of Partner'; // 1
        accumulatedData.sig2_1_right = 'Signature of Witness';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = 'Name of Partner';
        // accumulatedData.sig2_line_2_right =
        accumulatedData.sig2_2_right = 'Name of Witness (Please print)';

        accumulatedData.sig2_3_left = 'Signature of Partner'; // 2
        accumulatedData.sig2_3_right = 'Signature of Witness';
        accumulatedData.sig2_line_4_left = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_4_left = 'Name of Partner';
        // accumulatedData.sig2_line_4_right =
        accumulatedData.sig2_4_right = 'Name of Witness';
        if(accumulatedData.sig_3rd_2.length > 0) {

          accumulatedData.sig2_5_left = 'Signature of Partner'; // 3
          accumulatedData.sig2_5_right = 'Signature of Witness';
          accumulatedData.sig2_line_6_left = accumulatedData.sig_3rd_2 + linePadding(accumulatedData.sig_3rd_2);
          accumulatedData.sig2_6_left = 'Name of Partner';
          // accumulatedData.sig2_line_6_right =
          accumulatedData.sig2_6_right = 'Name of Witness';
        } else {
          accumulatedData.sig2_5_left = ''; // 3
          accumulatedData.sig2_5_right = '';
          accumulatedData.sig2_6_left = '';
          accumulatedData.sig2_6_right = '';
          // lines
          accumulatedData.sig2_line_5_left = '';
          accumulatedData.sig2_line_5_right = '';
          accumulatedData.sig2_line_6_left = '';
          accumulatedData.sig2_line_6_right = '';
        }
      }else if($("input[name='submitted[" + edit_submitted_2a_other_party_details_company + "]']:checked").val() == 'proprietary_limited_company') {
        accumulatedData.name_2 = $('#'+edit_submitted_2_company_2_a_i_company_name+'', formID).val();
        accumulatedData.address_2 = $('#'+edit_submitted_2_company_2_a_i_registered_business_address+'', formID).val();

        /*
        accumulatedData.abn_or_acn_2 = $("input[name='submitted[2_company][2_a_i_abn_or_acn]']:checked").val();
        if(accumulatedData.abn_or_acn_2 == 'ABN') {
          accumulatedData.abn_acn_2 = 'ABN ' + $('#edit-submitted-2-company-2-a-i-abn', formID).val();
        } else {
          accumulatedData.abn_acn_2 = 'ACN ' + $('#edit-submitted-2-company-2-a-i-acn', formID).val();
        }
        */
        accumulatedData.abn_or_acn_2 = 'ABN';
        accumulatedData.abn_acn_2 = 'ABN ' + $('#'+edit_submitted_2_company_2_a_i_abn+'', formID).val();

        // accumulatedData.email_2 = $('#edit-submitted-2-company-2-a-i-e-mail', formID).val();
        accumulatedData.sig_1st_2 = $('#'+edit_submitted_2_company_2_a_i_signatory_one_full_name_of_director+'', formID).val();
        accumulatedData.sig_2nd_2 = $('#'+edit_submitted_2_company_2_a_i_signatory_two_full_name_of_director_company_secretary+'', formID).val();

        accumulatedData.sig2_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
        accumulatedData.name_2 +
        // (accumulatedData.abn_or_acn_2 == 'ABN' ? ' ABN [' : ' ACN [') +
        ' ' +
        accumulatedData.abn_acn_2 +
        ' in accordance with section 127(1) of the Corporations Act 2001';

        accumulatedData.sig2_1_left =  'Signature of Director'; // 1
        accumulatedData.sig2_1_right = 'Signature of Director / Company Secretary (delete as applicable)';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left =  'Name of Director';
        accumulatedData.sig2_line_2_right = accumulatedData.sig_2nd_2 + linePadding(accumulatedData.sig_2nd_2);
        accumulatedData.sig2_2_right = 'Name of Director / Company Secretary (delete as applicable)';
        accumulatedData.sig2_3_left = ''; // 2
        accumulatedData.sig2_3_right = '';
        accumulatedData.sig2_4_left = '';
        accumulatedData.sig2_4_right = '';
        accumulatedData.sig2_5_left = ''; // 3
        accumulatedData.sig2_5_right = '';
        accumulatedData.sig2_6_left = '';
        accumulatedData.sig2_6_right = '';

        //lines
        accumulatedData.sig2_line_3_left = '';
        accumulatedData.sig2_line_3_right = '';
        accumulatedData.sig2_line_4_left =  '';
        accumulatedData.sig2_line_4_right = '';
        accumulatedData.sig2_line_5_left = '';
        accumulatedData.sig2_line_5_right = '';
        accumulatedData.sig2_line_6_left = '';
        accumulatedData.sig2_line_6_right = '';
      } else if ($("input[name='submitted[" + edit_submitted_2a_other_party_details_company + "]']:checked").val() == 'sole_director_company') {
        accumulatedData.name_2 = $('#'+edit_submitted_2_sole_director_company_2_a_ii_company_name+'', formID).val();
        accumulatedData.address_2 = $('#'+edit_submitted_2_sole_director_company_2_a_ii_registered_business_address+'', formID).val();

        /*
        accumulatedData.abn_or_acn_2 = $("input[name='submitted[2_sole_director_company][2_a_ii_abn_or_acn]']:checked").val();
        if(accumulatedData.abn_or_acn_2 == 'ABN') {
          accumulatedData.abn_acn_2 = 'ABN ' +  $('#edit-submitted-2-sole-director-company-2-a-ii-abn', formID).val();
        } else {
          accumulatedData.abn_acn_2 = 'ACN ' +  $('#edit-submitted-2-sole-director-company-2-a-ii-acn', formID).val();
        }
        */
        accumulatedData.abn_or_acn_2 = 'ABN';
        accumulatedData.abn_acn_2 = 'ACN ' +  $('#'+edit_submitted_2_sole_director_company_2_a_ii_abn+'', formID).val();

        // accumulatedData.email_2 = $('#edit-submitted-2-sole-director-company-2-a-ii-e-mail', formID).val();
        accumulatedData.sig_1st_2 = $('#'+edit_submitted_2_sole_director_company_2_a_ii_signatory_full_name_of_director+'', formID).val();
        accumulatedData.sig_2nd_2 = '';

        accumulatedData.sig2_intro_text = 'SIGNED SEALED AND DELIVERED by ' +
          accumulatedData.name_2 +
          // (accumulatedData.abn_or_acn_2 == 'ABN' ? ' ABN [' : ' ACN [') +
          ' ' +
          accumulatedData.abn_acn_2 +
          ' in accordance with section 127(1) of the Corporations Act 2001';

        accumulatedData.sig2_1_left = 'Signature of Sole Director'; // 1
        accumulatedData.sig2_2_right = '';
        accumulatedData.sig2_line_2_left = accumulatedData.sig_1st_2 + linePadding(accumulatedData.sig_1st_2);
        accumulatedData.sig2_2_left = 'Name of Sole Director';
        accumulatedData.sig2_2_right = '';
        accumulatedData.sig2_3_left = ''; // 2
        accumulatedData.sig2_3_right = '';
        accumulatedData.sig2_4_left = '';
        accumulatedData.sig2_4_right = '';
        accumulatedData.sig2_5_left = ''; // 3
        accumulatedData.sig2_5_right = '';
        accumulatedData.sig2_6_left = '';
        accumulatedData.sig2_6_right = '';

        //lines
        accumulatedData.sig2_line_1_right = '';
        accumulatedData.sig2_line_2_right = '';
        accumulatedData.sig2_line_3_left = '';
        accumulatedData.sig2_line_3_right = '';
        accumulatedData.sig2_line_4_left =  '';
        accumulatedData.sig2_line_4_right = '';
        accumulatedData.sig2_line_5_left = '';
        accumulatedData.sig2_line_5_right = '';
        accumulatedData.sig2_line_6_left = '';
        accumulatedData.sig2_line_6_right = '';
      }

      // 3
      accumulatedData.permittedPurpose = $('#' + edit_submitted_3_permitted_purpose + '', formID).val();
      // 4
      accumulatedData.durationOfObligations = $("input[name='submitted[" + edit_submitted_4_duration_of_obligations + "]']:checked").val().replace(/_/g, ' ');
      // 5
      accumulatedData.jurisdiction =$("input[name='submitted[" + edit_submitted_5_law_and_jurisdiction + "]']:checked").val(); //$('#' + element_name + ' option:selected', formID).text();

      // add start & end tags for the xml
      /*
      for (var prop in accumulatedData) {
        if (accumulatedData.hasOwnProperty(prop)) {
          accumulatedData[prop] = '<w:p><w:r><w:t>' + accumulatedData[prop] + '</w:t></w:r></w:p>';
        }
      }
      */
      // end xml
      // generate the file
      var templateFilePath = '';
      if(accumulatedData.one_way_or_two_way == 'one_way') {
        templateFilePath = '/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/template-one.docx'
      } else {
        templateFilePath = '/sites/g/files/net856/themes/site/ipaustralia/interactives/nda_generator/template-two.docx'
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
