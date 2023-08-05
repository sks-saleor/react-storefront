import { getSubdomain } from "@/lib/subdomain";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document<{ lang?: string; API_URI: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const { API_URI } = getSubdomain(ctx.req?.headers.host!);
    return { ...initialProps, lang: ctx?.query?.locale, API_URI };
  }

  render() {
    // @todo remove this hack when we have a better solution for API_URI
    process.env.API_URI = this.props.API_URI;
    const uri = process.env.API_URI!;
    const { hostname } = new URL(uri);

    return (
      <Html lang={this.props.lang}>
        <Head>
          <link rel="preconnect" href={`//${hostname}`} crossOrigin="true" />
          <link rel="dns-prefetch" href={`//${hostname}`} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body spellCheck={false}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
