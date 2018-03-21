import React from 'react';

import './index.css'

const Terms = () =>
  <div>
    <h2>Terms</h2>
    <h3>Hello!</h3>
    <div>
      First off, thank you for using Elop Party. By using Elop Party, you agree to the Terms. If you don’t agree with them, then don’t use the Services.<br/>
    </div>
    <br />
    <h4>1. Usage</h4>
    <div>
      By using Elop Party, you state that:<br />
      You can form a binding contract with Elop Party.<br/>
      You will comply with these Terms and all applicable local, state, national, and international laws, rules, and regulations.<br/>
      You may not copy, modify, distribute, sell, or lease any part of Elop Party, nor may you reverse engineer or attempt to extract the source code of that software, unless applicable laws prohibit these restrictions or you have our written permission to do so.<br/>
    </div>
    <br />
    <h4>2. Our Right</h4>
    <div>
      You grant us a license to use any content you share and any actions/activities taken.<br />
      Elop Party may access, review, screen, and delete your content at any time and for any reason. You remain responsible for the content you create, upload, post, send, or store through Elop Party.<br/>
    </div>
    <br />
    <h4>3. Usage of Others</h4>
    <div>
      We do not take responsibility for any content that others provide through Elop Party.<br />
    </div>
    <br/>
    <h4>4. Disclaimers</h4>
    <div>
      THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” AND TO THE EXTENT PERMITTED BY APPLICABLE LAW WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. IN ADDITION, WHILE SNAP INC. ATTEMPTS TO PROVIDE A GOOD USER EXPERIENCE, WE DO NOT REPRESENT OR WARRANT THAT: (A) THE SERVICES WILL ALWAYS BE SECURE, ERROR-FREE, OR TIMELY; (B) THE SERVICES WILL ALWAYS FUNCTION WITHOUT DELAYS, DISRUPTIONS, OR IMPERFECTIONS; OR (C) THAT ANY CONTENT, USER CONTENT, OR INFORMATION YOU OBTAIN ON OR THROUGH THE SERVICES WILL BE TIMELY OR ACCURATE.<br/>
      ELOP PARTY TAKES NO RESPONSIBILITY AND ASSUMES NO LIABILITY FOR ANY CONTENT THAT YOU, ANOTHER USER, OR A THIRD PARTY CREATES, UPLOADS, POSTS, SENDS, RECEIVES, OR STORES ON OR THROUGH OUR SERVICES. YOU UNDERSTAND AND AGREE THAT YOU MAY BE EXPOSED TO CONTENT THAT MIGHT BE OFFENSIVE, ILLEGAL, MISLEADING, OR OTHERWISE INAPPROPRIATE, NONE OF WHICH SNAP INC. WILL BE RESPONSIBLE FOR.<br/>
    </div>
  </div>

const TermsAgreement = () =>
  <small className="terms">By signing up, you agree to the <a href="/terms">Terms of Elop Party</a>.</small>

export {
  TermsAgreement
};

export default Terms;
