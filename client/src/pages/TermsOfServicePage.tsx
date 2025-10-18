import { Typography, Divider, Link } from '@mui/material';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';

interface SectionProps {
  title: string;
  children: React.ReactNode;
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

export const TermsOfServicePage = () => (
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
        Terms of Service
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Last updated: October 17, 2025
      </Typography>
    </Column>

    <Divider />

    <Column spacing={3}>
      <Section title="1. Acceptance of Terms">
        By accessing and using this application, you accept and agree to be bound by the terms and
        provision of this agreement. If you do not agree to abide by the above, please do not use
        this service.
      </Section>

      <Section title="2. Use License">
        Permission is granted to temporarily access the materials (information or software) on this
        application for personal, non-commercial transitory viewing only. This is the grant of a
        license, not a transfer of title, and under this license you may not: modify or copy the
        materials; use the materials for any commercial purpose or for any public display; attempt
        to reverse engineer any software contained in the application; remove any copyright or other
        proprietary notations from the materials; or transfer the materials to another person or
        mirror the materials on any other server.
      </Section>

      <Section title="3. User Account">
        You are responsible for maintaining the confidentiality of your account and password and for
        restricting access to your computer. You agree to accept responsibility for all activities
        that occur under your account or password. We reserve the right to refuse service, terminate
        accounts, or remove or edit content at our sole discretion.
      </Section>

      <Section title="4. Privacy Policy">
        Your use of our application is also governed by our Privacy Policy. Please review our
        Privacy Policy, which also governs the site and informs users of our data collection
        practices. By using this application, you consent to the data practices described in our
        Privacy Policy.
      </Section>

      <Section title="5. User Content">
        You retain all rights to any content you submit, post or display on or through the
        application. By submitting, posting or displaying content, you grant us a worldwide,
        non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify,
        publish, transmit, display and distribute such content in any and all media or distribution
        methods.
      </Section>

      <Section title="6. Prohibited Uses">
        You may not use the application for any illegal or unauthorized purpose. You must not, in
        the use of the service, violate any laws in your jurisdiction (including but not limited to
        copyright laws). You shall not transmit any worms or viruses or any code of a destructive
        nature.
      </Section>

      <Section title="7. Disclaimer">
        The materials on this application are provided on an as is basis. We make no warranties,
        expressed or implied, and hereby disclaim and negate all other warranties including, without
        limitation, implied warranties or conditions of merchantability, fitness for a particular
        purpose, or non-infringement of intellectual property or other violation of rights.
      </Section>

      <Section title="8. Limitations">
        In no event shall our company or its suppliers be liable for any damages (including, without
        limitation, damages for loss of data or profit, or due to business interruption) arising out
        of the use or inability to use the materials on this application, even if we or our
        authorized representative has been notified orally or in writing of the possibility of such
        damage.
      </Section>

      <Section title="9. Service Modifications">
        We reserve the right to modify or discontinue, temporarily or permanently, the service (or
        any part thereof) with or without notice at any time. You agree that we shall not be liable
        to you or to any third party for any modification, suspension, or discontinuance of the
        service.
      </Section>

      <Section title="10. Governing Law">
        These terms and conditions are governed by and construed in accordance with the laws of the
        applicable jurisdiction and you irrevocably submit to the exclusive jurisdiction of the
        courts in that location.
      </Section>

      <Section title="11. Changes to Terms">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
        If a revision is material, we will try to provide at least 30 days notice prior to any new
        terms taking effect. What constitutes a material change will be determined at our sole
        discretion.
      </Section>

      <Section title="12. Contact Information">
        If you have any questions about these Terms of Service, please contact us at{' '}
        <Link href="mailto:support@example.com" sx={{ color: 'primary.main' }}>
          support@example.com
        </Link>
        .
      </Section>
    </Column>

    <Divider />

    <Row spacing={2} sx={{ justifyContent: 'center', paddingTop: 2 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        © 2025 Your Company. All rights reserved.
      </Typography>
    </Row>
  </Column>
);

export default TermsOfServicePage;
