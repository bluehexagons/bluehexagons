import '../bootstrap';
import { render } from '../render';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

render(
  <>
    <content-area>
      <page-header slot="content"></page-header>

      <article slot="content">
        <h1>Privacy Policy</h1>
        <p>
          <em>Effective Date: April 11, 2025</em>
        </p>

        <p>
          This Privacy Policy describes how bluehexagons ("we", "us", or "our") handles information in connection with the operation
          of the bluehexagons.com website and related services, including the Antistatic game server functionalities.
        </p>

        <h2>Information We Collect</h2>
        <p>We collect very limited information:</p>
        <ul>
          <li>
            <strong>Standard Web Server Logs:</strong> Like most web servers, ours automatically logs basic information about requests it
            receives. This typically includes your IP address, the date and time of your request, the page you requested, your browser
            type, and the referring page. These logs are used for standard server operation, monitoring, and security.
          </li>
          <li>
            <strong>Peer-to-Peer (P2P) Game Communication Information:</strong> For online features in games like Antistatic that use P2P
            connections, we may temporarily store your IP address and network port information. This information is used solely to
            facilitate the connection between you and other players.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <p>The information we collect is used solely for the following purposes:</p>
        <ul>
          <li>To operate, maintain, and secure our website and servers.</li>
          <li>To enable peer-to-peer connections for online game features.</li>
          <li>To diagnose technical problems.</li>
        </ul>
        <p>We do not use analytics software, tracking cookies, or third-party advertising networks on our website.</p>

        <h2>Third-Party Services</h2>
        <p>
          <strong>Cloudflare:</strong> We use Cloudflare to enhance website performance and security. Cloudflare may collect log data about
          visitors to our website as part of their service. We do not control Cloudflare's data collection or use. You can review{' '}
          <site-link href="https://www.cloudflare.com/privacypolicy/">Cloudflare's Privacy Policy</site-link> for more information.
        </p>

        <p>
          <strong>Digital Ocean:</strong> Our website and associated services are hosted on infrastructure provided by Digital Ocean.
          Digital Ocean acts as a data processor and may handle data necessary for hosting operations. You can review{' '}
          <site-link href="https://www.digitalocean.com/legal/privacy-policy">Digital Ocean's Privacy Policy</site-link> for more details
          on their practices.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable measures to protect the limited information we handle. However, no internet transmission or
          electronic storage is 100% secure.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain P2P connection information long enough to facilitate the connection between players, typically seconds to minutes.
          Traffic logs are stored per server instance.
        </p>

        <h2>Your Rights</h2>
        <p>If you have concerns about any potential data we might hold, please contact us, but we try not to hold any.</p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on
          this page and updating the "Effective Date" at the top.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:{' '}
          <site-link href="mailto:this@bluehexagons.com">this@bluehexagons.com</site-link>
        </p>
      </article>
    </content-area>

    <page-footer></page-footer>
  </>,
  app
);
