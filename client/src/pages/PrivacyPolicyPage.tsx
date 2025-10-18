import { Typography, Divider, Link, Chip } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <Column spacing={1.5}>
    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
      {title}
    </Typography>
    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
      {children}
    </Typography>
  </Column>
);

interface ListItemProps {
  items: string[];
}

const BulletList = ({ items }: ListItemProps) => (
  <Column spacing={1} sx={{ paddingLeft: 2 }}>
    {items.map((item, index) => (
      <Row key={index} spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="body1" sx={{ color: 'primary.main', minWidth: '8px' }}>
          •
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          {item}
        </Typography>
      </Row>
    ))}
  </Column>
);

export const PrivacyPolicyPage = () => (
  <Column
    spacing={4}
    sx={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: { xs: 2, sm: 3, md: 4 },
    }}
  >
    <Column spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Privacy Policy
      </Typography>
      <Row spacing={1} sx={{ alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Last updated: October 17, 2025
        </Typography>
        <Chip label="GDPR Compliant" size="small" color="success" />
      </Row>
    </Column>

    <Divider />

    <Column spacing={3}>
      <Section title="1. Introduction">
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information
        when you use our application. Please read this privacy policy carefully. If you do not agree
        with the terms of this privacy policy, please do not access the application. We reserve the
        right to make changes to this Privacy Policy at any time and for any reason.
      </Section>

      <Section title="2. Information We Collect">
        We may collect information about you in a variety of ways. The information we may collect
        via the application includes:
      </Section>

      <Column spacing={2} sx={{ paddingLeft: 2 }}>
        <Column spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Personal Data
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            Personally identifiable information, such as your name, email address, and contact
            information that you voluntarily give to us when you register or when you choose to
            participate in various activities related to the application.
          </Typography>
        </Column>

        <Column spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Usage Data
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            Information automatically collected when you access the application, including your IP
            address, browser type, operating system, access times, and the pages you have viewed
            directly before and after accessing the application.
          </Typography>
        </Column>

        <Column spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Device Data
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
            Information about your device such as hardware model, operating system version, unique
            device identifiers, and mobile network information.
          </Typography>
        </Column>
      </Column>

      <Section title="3. How We Use Your Information">
        We use the information we collect in the following ways:
      </Section>

      <BulletList
        items={[
          'To provide, operate, and maintain our application',
          'To improve, personalize, and expand our application',
          'To understand and analyze how you use our application',
          'To develop new products, services, features, and functionality',
          'To communicate with you for customer service, updates, and marketing purposes',
          'To process your transactions and manage your account',
          'To send you emails and notifications',
          'To find and prevent fraud',
          'To comply with legal obligations',
        ]}
      />

      <Section title="4. Disclosure of Your Information">
        We may share information we have collected about you in certain situations. Your information
        may be disclosed as follows:
      </Section>

      <BulletList
        items={[
          'By Law or to Protect Rights: If we believe disclosure is necessary to comply with applicable law, regulation, legal process, or governmental request',
          'Business Transfers: In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business',
          'Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf',
          'With Your Consent: We may disclose your personal information for any other purpose with your consent',
        ]}
      />

      <Section title="5. Data Security">
        We use administrative, technical, and physical security measures to help protect your
        personal information. While we have taken reasonable steps to secure the personal
        information you provide to us, please be aware that despite our efforts, no security
        measures are perfect or impenetrable, and no method of data transmission can be guaranteed
        against any interception or other type of misuse.
      </Section>

      <Section title="6. Data Retention">
        We will retain your personal information only for as long as is necessary for the purposes
        set out in this Privacy Policy. We will retain and use your information to the extent
        necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
      </Section>

      <Section title="7. Your Privacy Rights">
        Depending on your location, you may have the following rights regarding your personal data:
      </Section>

      <BulletList
        items={[
          'The right to access: You have the right to request copies of your personal data',
          'The right to rectification: You have the right to request that we correct any information you believe is inaccurate',
          'The right to erasure: You have the right to request that we erase your personal data, under certain conditions',
          'The right to restrict processing: You have the right to request that we restrict the processing of your personal data',
          'The right to object to processing: You have the right to object to our processing of your personal data',
          'The right to data portability: You have the right to request that we transfer the data that we have collected to another organization',
        ]}
      />

      <Section title="8. Cookies and Tracking Technologies">
        We may use cookies and similar tracking technologies to track activity on our application
        and store certain information. You can instruct your browser to refuse all cookies or to
        indicate when a cookie is being sent. However, if you do not accept cookies, you may not be
        able to use some portions of our application.
      </Section>

      <Section title="9. Third-Party Websites">
        The application may contain links to third-party websites and applications. We are not
        responsible for the privacy practices or content of these third-party sites. We encourage
        you to read the privacy statements of every website you visit.
      </Section>

      <Section title="10. Children's Privacy">
        Our application does not address anyone under the age of 13. We do not knowingly collect
        personally identifiable information from children under 13. If you are a parent or guardian
        and you are aware that your child has provided us with personal data, please contact us.
      </Section>

      <Section title="11. International Data Transfers">
        Your information may be transferred to and maintained on computers located outside of your
        state, province, country, or other governmental jurisdiction where the data protection laws
        may differ. We will take all steps reasonably necessary to ensure that your data is treated
        securely and in accordance with this Privacy Policy.
      </Section>

      <Section title="12. Changes to This Privacy Policy">
        We may update our Privacy Policy from time to time. We will notify you of any changes by
        posting the new Privacy Policy on this page and updating the Last updated date. You are
        advised to review this Privacy Policy periodically for any changes.
      </Section>

      <Section title="13. Contact Us">
        If you have questions or comments about this Privacy Policy, please contact us at:
      </Section>

      <Column spacing={1} sx={{ paddingLeft: 2 }}>
        <Row spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Email:
          </Typography>
          <Link href="mailto:privacy@example.com" sx={{ color: 'primary.main' }}>
            privacy@example.com
          </Link>
        </Row>
        <Row spacing={1}>
          <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Address:
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            123 Privacy Street, Suite 100, City, State 12345
          </Typography>
        </Row>
      </Column>
    </Column>

    <Divider />

    <Row spacing={2} sx={{ justifyContent: 'center', paddingTop: 2 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2025 Your Company. All rights reserved.
      </Typography>
    </Row>
  </Column>
);

export default PrivacyPolicyPage;
