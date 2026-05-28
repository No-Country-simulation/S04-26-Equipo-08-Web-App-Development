interface DocuSealFormProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  "data-src"?: string;
  "data-email"?: string;
  "data-name"?: string;
  "data-language"?: string;
  "data-completed-redirect-url"?: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    "docuseal-form": DocuSealFormProps;
  }
}
