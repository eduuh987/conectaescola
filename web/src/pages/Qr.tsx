
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import QRCode from "qrcode";
import { usePageTitle, useSite } from "../lib";

// Tela para projetar no dia da apresentação: os pais apontam a câmera e caem direto no cadastro.
export default function QrPage() {
  usePageTitle("QR Code");

  const { publicUrl, school } = useSite();
  const [url, setUrl] = useState("");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fromQuery = new URLSearchParams(location.search).get("url");
    const selectedUrl = fromQuery || publicUrl || location.origin;

    try {
      const parsed = new URL(selectedUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Endereço inválido");
      }
      setUrl(parsed.origin + parsed.pathname.replace(/\/$/, ""));
    } catch {
      setUrl("");
      setSvg("");
      setError("Não foi possível identificar o endereço da plataforma.");
    }
  }, [publicUrl]);

  const target = url ? `${url.replace(/\/$/, "")}/cadastro` : "";

  useEffect(() => {
    if (!target) return;

    let active = true;

    setSvg("");
    setError("");

    QRCode.toString(target, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#1F2A37",
        light: "#FFFFFF",
      },
    })
      .then((generatedSvg) => {
        if (active) {
          setSvg(generatedSvg);
          setError("");
        }
      })
      .catch(() => {
        if (active) {
          setSvg("");
          setError("Não foi possível gerar o QR Code. Atualize a página e tente novamente.");
        }
      });

    return () => {
      active = false;
    };
  }, [target]);

  const isLocalhost = /localhost|127\.0\.0\.1/.test(url);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand p-6 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-pop">
        <GraduationCap className="h-9 w-9 text-brand" strokeWidth={2.2} />
      </div>

      <h1 className="mt-4 font-display text-4xl font-extrabold text-white sm:text-5xl">
        Conecta Escola
      </h1>

      <p className="mt-2 text-lg text-white/80">
        Aponte a câmera do celular e crie sua conta
      </p>

      <div className="mt-8 flex h-[min(70vw,360px)] w-[min(70vw,360px)] items-center justify-center rounded-[28px] bg-white p-5 shadow-pop">
        {svg ? (
          <div
            className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : error ? (
          <p className="max-w-xs text-sm font-medium text-red-700">
            {error}
          </p>
        ) : (
          <p className="text-sm text-ink-soft">
            Gerando QR Code...
          </p>
        )}
      </div>

      {target && (
        <p className="mt-6 break-all rounded-full bg-mustard px-5 py-2 font-display text-lg font-bold text-ink">
          {target.replace(/^https?:\/\//, "")}
        </p>
      )}

      {school && (
        <p className="mt-3 text-sm text-white/70">
          {school.name}
        </p>
      )}

      {isLocalhost && (
        <p className="mt-6 max-w-md rounded-xl bg-white/10 px-4 py-3 text-sm text-white">
          Atenção: este QR aponta para <b>localhost</b> e não vai abrir no
          celular. Abra esta página pelo IP do notebook (ex.:
          http://192.168.0.10:8080/qr) ou defina PUBLIC_URL no .env.
        </p>
      )}
    </div>
  );
}

