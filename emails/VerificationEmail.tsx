import {
  Html,
  Head,
  Body,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  email: string;
  verifyCode: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://intrvu.codewithlokesh.com";

export default function VerificationEmail({ email, verifyCode }: VerificationEmailProps) {
  const verifyUrl = `${BASE_URL}/verify?email=${encodeURIComponent(email)}`;

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verify Your Email</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your verification code is: {verifyCode}</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading as="h2" style={styles.heading}>
            Verify your email
          </Heading>

          <Text style={styles.text}>
            Thanks for joining Intrvu! Use the code below to verify{" "}
            <strong>{email}</strong>.
          </Text>

          <Section style={styles.centered}>
            <Text style={styles.code}>{verifyCode}</Text>
          </Section>

          <Section style={styles.centered}>
            <Button href={verifyUrl} style={styles.button}>
              Verify Account
            </Button>
          </Section>

          <Text style={styles.footer}>
            If you didn’t request this, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f4f4f7",
    margin: "0",
    padding: "40px 0",
    fontFamily: "Roboto, Verdana, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "40px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    margin: "0 0 20px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    margin: "0 0 20px",
  },
  centered: {
    textAlign: "center" as const,
    margin: "0 0 24px",
  },
  code: {
    display: "inline-block",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#000",
    backgroundColor: "#f0f0f0",
    padding: "12px 20px",
    borderRadius: "6px",
    letterSpacing: "4px",
    margin: "0",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#ffffff",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  footer: {
    fontSize: "14px",
    color: "#999",
    margin: "0",
  },
};