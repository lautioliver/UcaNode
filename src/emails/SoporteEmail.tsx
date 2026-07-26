import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export type SoporteEmailProps = {
  nombre: string;
  email: string;
  carrera: string | null;
  categoria: string | null;
  asunto: string;
  mensaje: string;
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

export function SoporteEmail({
  nombre,
  email,
  carrera,
  categoria,
  asunto,
  mensaje,
}: SoporteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{asunto} — mensaje de soporte UcaNode</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brand}>UcaNode</Text>
          </Section>

          <Section style={styles.card}>
            <Heading style={styles.heading}>Nuevo mensaje de soporte</Heading>
            <Text style={styles.paragraph}>
              <strong style={styles.strong}>Asunto:</strong> {asunto}
            </Text>
            {categoria && (
              <Text style={styles.paragraph}>
                <strong style={styles.strong}>Categoría:</strong> {categoria}
              </Text>
            )}
            <Text style={styles.paragraph}>
              <strong style={styles.strong}>De:</strong> {nombre} ({email})
            </Text>
            {carrera && (
              <Text style={styles.paragraph}>
                <strong style={styles.strong}>Carrera:</strong> {carrera}
              </Text>
            )}

            <Hr style={styles.hr} />

            <Text style={styles.messageLabel}>Mensaje</Text>
            <Text style={styles.messageBody}>{mensaje}</Text>
          </Section>

          <Text style={styles.footer}>
            Respondé directamente a este mail para contactar al usuario (reply-to configurado).
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
    margin: "0 0 8px",
  },
  strong: {
    color: colors.primary,
    fontWeight: 600,
  },
  hr: {
    borderColor: colors.border,
    margin: "20px 0 16px",
  },
  messageLabel: {
    color: colors.muted,
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    margin: "0 0 8px",
    textTransform: "uppercase" as const,
  },
  messageBody: {
    color: colors.primary,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  footer: {
    color: colors.muted,
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "16px 0 0",
    textAlign: "center" as const,
  },
} satisfies Record<string, React.CSSProperties>;
