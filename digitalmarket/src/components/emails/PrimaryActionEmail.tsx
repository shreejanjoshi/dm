import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  render,
} from "@react-email/components";

import * as React from "react";

// ------------------------------------------------------------
// ------------------------------------------------------------

interface EmailTemplateProps {
  actionLabel: string;
  buttonText: string;
  href: string;
}

// ------------------------------------------------------------
// ------------------------------------------------------------

export const EmailTemplate = ({
  actionLabel,
  buttonText,
  href,
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>The marketplace for high-quality digital goods.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-newsletter-sign-up.png`}
            width="150"
            height="150"
            alt="DigitalHippo"
            style={logo}
          />
          <Text style={paragraph}>Hi there,</Text>
          <Text style={paragraph}>
            Welcome to DigitalHippo, the marketplace for high quality digital
            goods. Use the button below to {actionLabel}.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={href}>
              {buttonText}
            </Button>
          </Section>
          <Text style={paragraph}>
            Best,
            <br />
            The DigitalHippo team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you did not request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

// we need to return the HTML we cant just past it as is in there we need to reeturn this from the component becasue again thisis nothing else than a standard react componenet and now to access the actual HTML as the string from this email this is as stringforward as with the received email. And this how we do it
export const PrimaryActionEmailHtml = (props: EmailTemplateProps) =>
  // we gonna spread in all the props because we know they are the exact same
  // we are also configuration object where the pretty property is going to be true
  render(<EmailTemplate {...props} />, { pretty: true });

// ------------------------------------------------------------
// ------------------------------------------------------------

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

// ------------------------------------------------------------

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

// ------------------------------------------------------------

const logo = {
  margin: "0 auto",
};

// ------------------------------------------------------------

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

// ------------------------------------------------------------

const btnContainer = {
  textAlign: "center" as const,
};

// ------------------------------------------------------------

const button = {
  padding: "12px 12px",
  backgroundColor: "#2563eb",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
};

// ------------------------------------------------------------

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

// ------------------------------------------------------------

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
