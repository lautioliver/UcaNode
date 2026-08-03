export type TermsSection = {
  title: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: { title?: string; paragraphs?: string[]; list?: string[] }[];
};

export const TERMS_META = {
  title: "Términos y Condiciones de Uso de UcaNode",
  updatedAt: "Agosto de 2026",
  contactUrl: "/soporte",
  contactLabel: "ucanode.app/soporte",
} as const;

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "1. Alcance y Aceptación",
    paragraphs: [
      'Los presentes Términos y Condiciones rigen el acceso y uso de la plataforma UcaNode (en adelante, el "Servicio" o "la Plataforma"). El registro y uso de la Plataforma por parte del usuario (en adelante, el "Usuario") implica la aceptación plena y sin reservas de todas y cada una de las disposiciones incluidas en este documento.',
      "El acceso a UcaNode es libre y gratuito. El Servicio está destinado a estudiantes universitarios; el Usuario declara ser mayor de 16 años o contar con la debida capacidad/autorización para aceptar las obligaciones establecidas en el presente contrato.",
    ],
  },
  {
    title: "2. Registro, Credenciales y Seguridad de la Cuenta",
    paragraphs: [
      "El registro en UcaNode requiere la creación de una cuenta personal bajo las siguientes condiciones:",
    ],
    subsections: [
      {
        title: "Datos Recolectados",
        paragraphs: [
          "Únicamente se solicita una dirección de correo electrónico válida y una contraseña.",
        ],
      },
      {
        title: "Seguridad de la Contraseña",
        paragraphs: [
          "La contraseña nunca se almacena en texto plano. Es procesada y resguardada mediante algoritmos de cifrado unidireccional (hashing), garantizando que ni el Administrador ni terceros tengan acceso a la clave original.",
        ],
      },
      {
        title: "Obligaciones del Usuario respecto a la Cuenta",
        list: [
          "No proporcionar información personal falsa ni crear cuentas a nombre de terceros.",
          "No crear más de una cuenta personal ni intentar acceder a cuentas de otros Usuarios.",
          "No compartir la contraseña ni permitir que terceros accedan a su cuenta.",
          "Notificación: El Usuario se compromete a notificar inmediatamente al Administrador ante cualquier uso no autorizado o brecha de seguridad detectada en su clave o cuenta.",
        ],
      },
    ],
  },
  {
    title: "3. Protección de Datos Personales (Ley N° 25.326)",
    paragraphs: [
      "UcaNode cumple con lo establecido en la Ley N° 25.326 de Protección de Datos Personales de la República Argentina y sus normas complementarias:",
    ],
    list: [
      "Finalidad Exclusiva: El correo electrónico del Usuario será tratado con la única finalidad de gestionar la autenticación del perfil, validar el acceso a la Plataforma y prestar el servicio de soporte técnico. No se comercializará ni cederá dicha información a terceros bajo ningún concepto.",
      "Derechos del Titular (Hábeas Data): El Usuario titular de los datos personales tiene la facultad de ejercer el derecho de acceso, rectificación, actualización y supresión de sus datos en forma gratuita.",
      "Órgano de Control: Se informa que la Agencia de Acceso a la Información Pública (ex Dirección Nacional de Protección de Datos Personales), Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que se formulen con relación al incumplimiento de las normas sobre protección de datos personales.",
    ],
  },
  {
    title: "4. Usos Prohibidos y Seguridad de la Información",
    paragraphs: [
      "Queda expresamente prohibido realizar cualquier actividad que atente contra el normal funcionamiento del Servicio o la comunidad. En particular, el Usuario se compromete a NO:",
    ],
    list: [
      "Hostigar, acosar, amenazar o atentar contra la intimidad u honor de otros Usuarios o miembros de la comunidad educativa.",
      "Promover o difundir contenido difamatorio, obsceno, violento, o que contravenga las leyes vigentes.",
      "Cargar datos falsos o engañosos de forma maliciosa en los módulos colaborativos como CampuStatus o en los foros comunitarios.",
      "Divulgación Responsable de Vulnerabilidades: Divulgar públicamente vulnerabilidades técnicas o de seguridad detectadas en el Servicio sin antes comunicarlas de manera privada al Administrador para su pronta resolución.",
      "Intentar alterar, descompilar, saturar o realizar actos de vandalismo digital contra la infraestructura tecnológica del Servicio.",
    ],
    subsections: [
      {
        paragraphs: [
          "El Administrador se reserva el derecho de rechazar, suspender o cancelar el registro de cualquier Usuario que vulnere estas condiciones.",
        ],
      },
    ],
  },
  {
    title: "5. Propiedad Intelectual e Independencia Institucional",
    list: [
      "Aviso de Independencia: UcaNode es una iniciativa de desarrollo de software independiente y no forma parte, no está afiliada ni representa oficialmente a la Universidad Católica de Salta (UCASAL) ni a ninguna otra institución educativa.",
      "Propiedad Intelectual: Los componentes visuales, marcas, arquitectura técnica, código fuente e interfaz del Servicio son propiedad exclusiva de su desarrollador.",
      'Exención de Responsabilidad: La Plataforma se brinda "tal cual" (as-is). El Administrador no asume responsabilidad por eventuales errores de carga de fechas, cronogramas académicos o datos ingresados por los Usuarios, debiendo el Usuario verificar las fechas críticas siempre a través de las vías oficiales institucionales.',
    ],
  },
  {
    title: "6. Modificación de los Términos y Condiciones",
    paragraphs: [
      "El Administrador se reserva la facultad de modificar estos Términos y Condiciones en cualquier momento. Dichas modificaciones entrarán en vigencia a partir de su publicación en la Plataforma, notificando previamente a los Usuarios mediante aviso en la interfaz o vía correo electrónico.",
    ],
  },
  {
    title: "7. Ley Aplicable y Jurisdicción",
    paragraphs: [
      "Los presentes Términos y Condiciones se rigen por las leyes vigentes de la República Argentina. Cualquier controversia que derivase de la interpretación, validez o cumplimiento de los mismos será sometida a los Tribunales Ordinarios competentes del fuero correspondiente con asiento en la provincia de Salta, renunciando expresamente a cualquier otro fuero o jurisdicción.",
    ],
  },
];
