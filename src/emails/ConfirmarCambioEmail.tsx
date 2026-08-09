import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type ConfirmarCambioEmailProps = {
  nombre: string;
  currentEmail: string;
  newEmail: string;
  confirmUrl: string;
};

const colors = {
  surface: "#0b1220",
  card: "#111a2c",
  border: "#1e2a44",
  primary: "#f8fafc",
  secondary: "#94a3b8",
  muted: "#64748b",
  accent: "#60a5fa",
};

export function ConfirmarCambioEmail({
  nombre,
  currentEmail,
  newEmail,
  confirmUrl,
}: ConfirmarCambioEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirmá el cambio de email en UcaNode</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>UcaNode</Text>
          </Section>

          <Section style={styles.card}>
            <Heading style={styles.heading}>Confirmá el cambio de email</Heading>
            <Text style={styles.paragraph}>Hola {nombre},</Text>
            <Text style={styles.paragraph}>
              Recibimos una solicitud para cambiar el email de tu cuenta de{" "}
              <strong style={{ color: colors.primary }}>{currentEmail}</strong> a{" "}
              <strong style={{ color: colors.primary }}>{newEmail}</strong>.
            </Text>
            <Text style={styles.paragraph}>
              Si fuiste vos, confirmá el cambio con el botón de abajo. Después
              te enviaremos un mail al nuevo email para verificarlo.
            </Text>

            <Section style={styles.buttonSection}>
              <Button style={styles.button} href={confirmUrl}>
                Confirmar cambio de email
              </Button>
            </Section>

            <Text style={styles.note}>
              Este enlace expira en 24 horas. Si no solicitaste este cambio,
              ignorá este mensaje.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Si el botón no funciona, copiá y pegá este enlace en tu navegador:{" "}
            <Link href={confirmUrl} style={styles.link}>
              {confirmUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: colors.surface,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: "32px 16px",
  },
  container: {
    margin: "0 auto",
    maxWidth: "520px",
  },
  header: {
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  brand: {
    color: colors.primary,
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  card: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: "16px",
    padding: "28px 24px",
  },
  heading: {
    color: colors.primary,
    fontSize: "22px",
    fontWeight: 600,
    letterSpacing: "-0.02em",
    lineHeight: "1.3",
    margin: "0 0 16px",
  },
  paragraph: {
    color: colors.secondary,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 12px",
  },
  buttonSection: {
    margin: "24px 0 20px",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: "10px",
    color: colors.surface,
    display: "inline-block",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 24px",
    textDecoration: "none",
  },
  note: {
    color: colors.muted,
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
  hr: {
    borderColor: colors.border,
    margin: "24px 0 16px",
  },
  footer: {
    color: colors.muted,
    fontSize: "12px",
    lineHeight: "1.6",
    margin: 0,
    textAlign: "center" as const,
  },
  link: {
    color: colors.accent,
    textDecoration: "underline",
    wordBreak: "break-all" as const,
  },
} satisfies Record<string, React.CSSProperties>;
