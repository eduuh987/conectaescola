
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Briefcase, Camera, CheckCircle2, Clock, ExternalLink, ImagePlus, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api, apiUpload, formatDate, maskPhone, useApi, useAuth, usePageTitle, whatsappLink, type User } from "../lib";
import { Alert, Empty, ErrorState, Field, Input, Modal, Spinner, StatusBadge, Textarea } from "../ui";

type Service = { id: number; title: string; description: string; price: string };
type PortfolioImage = { id: number; image_url: string; created_at: string };

type Me = {
  user: User;
  school: { id: number; name: string } | null;
  profile: null | {
    slug: string; display_name: string; profession: string; category_id: number; bio: string; experience: string; city: string;
    neighborhood: string; service_area: string; whatsapp: string; contact_hours: string; price_range: string; published: number; hidden_by_admin: number;
  };
  services: Service[];
  portfolio: PortfolioImage[];
  sentQuotes: { id: number; description: string; status: string; created_at: string; display_name: string; slug: string }[];
  receivedQuotes: { id: number; description: string; status: string; created_at: string; family_name: string; family_phone: string; family_email: string }[];
  partnerships: { id: number; title: string; status: string; created_at: string }[];
};

const QUOTE_STATUS: Record<string, string> = { new: "Nova", answered: "Respondida", closed: "Encerrada" };

type OnboardingStep = "avatar" | "profile" | "portfolio" | "complete" | null;

export default function MinhaConta() {
  usePageTitle("Minha conta");
  const { refresh } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = params.get("aba") || "conta";
  const me = useApi<Me>("/me");

  const [wizardStep, setWizardStep] = useState<OnboardingStep>(() =>
    params.get("novo") === "1" && params.get("aba") === "perfil" ? "avatar" : null
  );

  const flowRef = useRef<HTMLDivElement>(null);
  const reload = () => { me.reload(); refresh(); };

  useEffect(() => {
    if (wizardStep) {
      window.setTimeout(() => flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }, [wizardStep]);

  if (me.loading && !me.data) return <Spinner />;
  if (me.error || !me.data) return <div className="container-x"><ErrorState error={me.error!} onRetry={me.reload} /></div>;

  const d = me.data;
  const isProfessional = !!d.user.is_professional || !!d.profile;
  const isNew = params.get("novo") === "1";

  const startProfessionalFlow = () => {
    setParams({ aba: "perfil" });
    setWizardStep("avatar");
  };

  const finishProfessionalFlow = () => {
    reload();
    setWizardStep("complete");
  };

  const tabs = [
    { id: "conta", label: "Minha conta" },
    { id: "perfil", label: isProfessional ? "Meu perfil profissional" : "Meu perfil" },
    ...(isProfessional ? [
      { id: "orcamentos", label: "Orçamentos" },
      { id: "parcerias", label: "Minhas parcerias" },
    ] : []),
  ];

  return (
    <div className="container-x py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold">Olá, {d.user.name.split(" ")[0]}!</h1>
      <StatusCard me={d} onChange={reload} isNew={isNew} />

      {isNew && !isProfessional && !d.user.is_admin && !wizardStep && (
        <section className="mt-6 overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-5 shadow-sm sm:p-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold text-sky-800">
              <Briefcase size={14} /> Bem-vindo ao Conecta Escola
            </span>
            <h2 className="mt-3 text-xl font-extrabold text-ink sm:text-2xl">Como você quer participar?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Você pode procurar serviços normalmente ou criar um perfil para oferecer seus próprios serviços. Essa escolha pode ser alterada depois.</p>
          </div>
          <div className="mx-auto mt-5 grid max-w-3xl gap-3 sm:grid-cols-2">
            <Link to="/profissionais" className="flex flex-col rounded-xl border border-sky-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex items-center gap-2 font-extrabold text-ink"><Search size={19} className="text-sky-700" /> Quero procurar profissionais</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">Encontre serviços oferecidos pela comunidade. Você não precisa criar um perfil profissional.</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">Encontrar profissionais <ArrowRight size={15} /></span>
            </Link>
            <button type="button" onClick={startProfessionalFlow} className="flex flex-col rounded-xl border-2 border-sky-300 bg-sky-50/70 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="flex items-center gap-2 font-extrabold text-ink"><Briefcase size={19} className="text-sky-700" /> Quero oferecer meus serviços</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">Monte seu perfil profissional, apresente seu trabalho e conecte-se com famílias da comunidade.</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand">Começar cadastro <ArrowRight size={15} /></span>
            </button>
          </div>
        </section>
      )}

      {isProfessional && !d.user.is_admin && !wizardStep && (
        <section className="mt-6 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={23} />
            <div>
              <p className="font-extrabold text-ink">Seu perfil profissional está ativo na sua conta</p>
              <p className="mt-1 text-sm text-ink-soft">Gerencie seus dados, serviços, pedidos de orçamento e oportunidades de parceria.</p>
            </div>
          </div>
          <button type="button" onClick={() => { setParams({ aba: "perfil" }); setWizardStep(null); }} className="btn-primary shrink-0">Gerenciar perfil <ArrowRight size={16} /></button>
        </section>
      )}

      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-line" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => { setWizardStep(null); setParams({ aba: t.id }); }}
            className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-bold transition ${tab === t.id ? "border-brand text-brand" : "border-transparent text-ink-soft hover:text-ink"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 scroll-mt-24" ref={flowRef}>
        {tab === "conta" && <AccountTab me={d} onSaved={reload} />}
        {tab === "perfil" && (
          <>
            {wizardStep === "avatar" && (
              <section className="mx-auto max-w-3xl space-y-5">
                <WizardProgress step={1} />
                <div>
                  <h2 className="text-2xl font-extrabold">Vamos preparar seu perfil!</h2>
                  <p className="mt-2 text-sm text-ink-soft">Primeiro, escolha uma foto para sua conta. Ela ajuda as pessoas a reconhecerem seu perfil, mas é opcional.</p>
                </div>
                <AvatarEditor user={d.user} onSaved={reload} />
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <button type="button" className="btn-ghost" onClick={() => setWizardStep("profile")}>Agora não</button>
                  <button type="button" className="btn-primary" onClick={() => setWizardStep("profile")}>Continuar <ArrowRight size={16} /></button>
                </div>
              </section>
            )}

            {wizardStep === "profile" && (
              <section className="space-y-5">
                <WizardProgress step={2} />
                <div>
                  <h2 className="text-2xl font-extrabold">Conte um pouco sobre seu trabalho</h2>
                  <p className="mt-2 text-sm text-ink-soft">Essas informações ajudam as famílias a conhecerem seus serviços e saberem como entrar em contato.</p>
                </div>
                <ProfileTab me={d} onSaved={reload} isWizard onNext={() => setWizardStep("portfolio")} />
              </section>
            )}

            {wizardStep === "portfolio" && (
              <section className="mx-auto max-w-4xl space-y-5">
                <WizardProgress step={3} />
                <div>
                  <h2 className="text-2xl font-extrabold">Mostre um pouco do seu trabalho</h2>
                  <p className="mt-2 text-sm text-ink-soft">Adicione fotos ao seu portfólio para apresentar exemplos do que você faz. Você pode pular esta etapa e incluir imagens depois.</p>
                </div>
                <PortfolioEditor images={d.portfolio || []} onChange={reload} />
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <button type="button" className="btn-ghost" onClick={finishProfessionalFlow}>Adicionar depois</button>
                  <button type="button" className="btn-primary" onClick={finishProfessionalFlow}>Concluir cadastro <CheckCircle2 size={16} /></button>
                </div>
              </section>
            )}

            {wizardStep === "complete" && (
              <section className="mx-auto max-w-3xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white px-6 py-10 text-center shadow-sm sm:px-10">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 size={36} /></div>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">Cadastro concluído</p>
                <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">Parabéns! Seu perfil profissional foi criado.</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">Agora você pode completar seus serviços, acompanhar pedidos de orçamento e conhecer oportunidades de parceria. {d.user.status !== "approved" ? "Seu perfil será exibido no diretório depois da aprovação da equipe da escola." : "Seu perfil já pode ser gerenciado pela sua conta."}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <Link to="/" className="btn-ghost justify-center border border-line">Página inicial</Link>
                  <button type="button" className="btn-primary justify-center" onClick={() => { setWizardStep(null); reload(); setParams({ aba: "perfil" }); }}>Meu perfil</button>
                  <Link to="/parcerias" className="btn-ghost justify-center border border-line">Procurar parcerias</Link>
                </div>
              </section>
            )}

            {!wizardStep && isProfessional && <ProfileTab me={d} onSaved={reload} />}

            {!wizardStep && !isProfessional && (
              <section className="mx-auto max-w-3xl rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700"><Briefcase size={24} /></div>
                  <div>
                    <h2 className="text-xl font-extrabold">Seu perfil no Conecta Escola</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">No momento, sua conta está configurada para procurar profissionais e serviços. Se você também deseja divulgar seu trabalho, pode criar um perfil profissional quando quiser.</p>
                    <button type="button" className="btn-primary mt-5" onClick={startProfessionalFlow}>Quero me tornar profissional <ArrowRight size={16} /></button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {tab === "orcamentos" && isProfessional && <QuotesTab me={d} onChange={me.reload} />}
        {tab === "parcerias" && isProfessional && <PartnershipsTab me={d} />}
      </div>
    </div>
  );
}

function WizardProgress({ step }: { step: 1 | 2 | 3 }) {
  const labels = ["Foto de perfil", "Dados profissionais", "Portfólio"];
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs font-bold text-ink-soft"><span>Etapa {step} de 3</span><span>{labels[step - 1]}</span></div>
      <div className="grid grid-cols-3 gap-2">
        {labels.map((label, index) => <div key={label} className={`h-2 rounded-full ${index < step ? "bg-brand" : "bg-cream-2"}`} />)}
      </div>
    </div>
  );
}

function StatusCard({ me, onChange, isNew }: { me: Me; onChange: () => void; isNew: boolean }) {
  const { user, school } = me;
  const [busy, setBusy] = useState(false);
  if (user.is_admin) return <div className="mt-4"><Alert kind="info">Você é administrador. <Link to="/admin" className="font-bold underline">Abrir painel de administração</Link></Alert></div>;
  return (
    <div className="card mt-5 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex flex-wrap items-center gap-2 text-sm">
          Vínculo com <b>{school?.name || "escola"}</b> <StatusBadge status={user.status} />
        </p>
        <p className="mt-1.5 text-sm text-ink-soft">
          {user.status === "pending" && (isNew ? "Conta criada! " : "") + "A equipe da escola vai analisar seu cadastro. Enquanto isso, você já pode navegar e preencher seu perfil."}
          {user.status === "approved" && "Tudo certo! Você tem acesso aos contatos, orçamentos, avaliações e ao mural de parcerias."}
          {user.status === "rejected" && <>Seu cadastro precisa de ajustes: <b>{user.status_reason}</b></>}
          {user.status === "suspended" && <>Sua conta está suspensa: <b>{user.status_reason}</b>. Fale com a equipe da escola.</>}
        </p>
      </div>
      {user.status === "rejected" && (
        <button
          className="btn-primary shrink-0"
          disabled={busy}
          onClick={async () => { setBusy(true); await api("/me/resubmit", { method: "POST" }).catch(() => {}); setBusy(false); onChange(); }}
        >
          Corrigi, reenviar para análise
        </button>
      )}
    </div>
  );
}

function AvatarEditor({ user, onSaved }: { user: User; onSaved: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setAvatarUrl(user.avatar_url || "");
  }, [user.avatar_url]);

  async function choosePhoto(file?: File) {
    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Escolha uma imagem JPG, PNG ou WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setBusy(true);

    try {
      const result = await apiUpload<{ ok: boolean; user: User }>("/me/avatar", file);
      setAvatarUrl(result.user.avatar_url || "");
      setSuccess("Foto de perfil atualizada!");
      onSaved();
    } catch (e: any) {
      setError(e.message || "Não foi possível enviar a foto.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removePhoto() {
    if (!confirm("Deseja realmente remover sua foto de perfil?")) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      await api("/me/avatar", { method: "DELETE" });
      setAvatarUrl("");
      setSuccess("Foto removida.");
      onSaved();
    } catch (e: any) {
      setError(e.message || "Não foi possível remover a foto.");
    } finally {
      setBusy(false);
    }
  }

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <section className="card p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-light font-display text-2xl font-extrabold text-brand">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`Foto de perfil de ${user.name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">Foto de perfil</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Escolha uma foto sua para deixar sua conta mais pessoal e facilitar sua identificação na comunidade.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => choosePhoto(e.target.files?.[0])}
            />

            <button
              type="button"
              className="btn-primary"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Camera size={16} />
              {busy ? "Aguarde..." : avatarUrl ? "Trocar foto" : "Escolher foto"}
            </button>

            {avatarUrl && (
              <button
                type="button"
                className="btn-ghost"
                disabled={busy}
                onClick={removePhoto}
              >
                <Trash2 size={16} />
                Remover
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      {success && <div className="mt-4"><Alert kind="success">{success}</Alert></div>}

      <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-ink-mute">
        Formatos aceitos: JPG, PNG e WebP. Tamanho máximo: 5 MB. Ao adicionar uma foto, você concorda que ela poderá ficar visível publicamente no Conecta Escola, inclusive no seu perfil profissional.
      </p>
    </section>
  );
}

function PortfolioEditor({ images, onChange }: { images: PortfolioImage[]; onChange: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const remaining = Math.max(0, 8 - images.length);

  async function uploadPhotos(files: FileList | null) {
    if (!files || files.length === 0) return;

    setError("");
    setSuccess("");

    const selected = Array.from(files);

    if (selected.length > remaining) {
      setError(`Você pode adicionar no máximo mais ${remaining} ${remaining === 1 ? "foto" : "fotos"}.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of selected) {
      if (!allowedTypes.includes(file.type)) {
        setError(`O arquivo "${file.name}" não é JPG, PNG ou WebP.`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(`O arquivo "${file.name}" ultrapassa o limite de 5 MB.`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setBusy(true);

    try {
      await apiUpload<{ ok: boolean; images: PortfolioImage[] }>("/me/portfolio", selected, "images");
      setSuccess(`${selected.length} ${selected.length === 1 ? "foto adicionada" : "fotos adicionadas"} ao portfólio!`);
      onChange();
    } catch (e: any) {
      setError(e.message || "Não foi possível enviar as fotos.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removePhoto(photo: PortfolioImage) {
    if (!confirm("Deseja realmente remover esta foto do portfólio?")) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      await api(`/me/portfolio/${photo.id}`, { method: "DELETE" });
      setSuccess("Foto removida do portfólio.");
      onChange();
    } catch (e: any) {
      setError(e.message || "Não foi possível remover a foto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Meu portfólio</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Mostre fotos dos seus trabalhos para que as famílias conheçam melhor seus serviços.
          </p>
        </div>
        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">
          {images.length}/8 fotos
        </span>
      </div>

      {images.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((photo) => (
            <div key={photo.id} className="group relative overflow-hidden rounded-xl border border-line bg-cream-2">
              <img
                src={photo.image_url}
                alt="Foto de trabalho do portfólio"
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => removePhoto(photo)}
                aria-label="Remover foto do portfólio"
                className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-line bg-cream-2 px-4 py-8 text-center">
          <ImagePlus className="mx-auto text-brand" size={32} />
          <p className="mt-2 text-sm font-bold">Seu portfólio ainda está vazio</p>
          <p className="mt-1 text-xs text-ink-soft">Adicione fotos dos seus trabalhos para montar sua galeria.</p>
        </div>
      )}

      {remaining > 0 && (
        <div className="mt-5">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(e) => uploadPhotos(e.target.files)}
          />
          <button
            type="button"
            className="btn-primary"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus size={16} />
            {busy ? "Enviando fotos..." : "Adicionar fotos"}
          </button>
        </div>
      )}

      {remaining === 0 && (
        <p className="mt-4 text-xs font-medium text-ink-soft">
          Você atingiu o limite de 8 fotos. Remova alguma imagem para adicionar outra.
        </p>
      )}

      {error && <div className="mt-4"><Alert>{error}</Alert></div>}
      {success && <div className="mt-4"><Alert kind="success">{success}</Alert></div>}

      <p className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-ink-mute">
        São permitidas até 8 imagens. Formatos aceitos: JPG, PNG e WebP. Cada imagem pode ter no máximo 5 MB. As fotos poderão ficar visíveis publicamente no seu perfil profissional.
      </p>
    </section>
  );
}

function AccountTab({ me, onSaved }: { me: Me; onSaved: () => void }) {
  const [f, setF] = useState({ name: me.user.name, phone: maskPhone(me.user.phone) });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; ok?: string; fields?: Record<string, string> }>({});
  const [pw, setPw] = useState({ current: "", password: "" });
  const [pst, setPst] = useState<{ busy?: boolean; err?: string; ok?: boolean; fields?: Record<string, string> }>({});

  return (
    <div className="space-y-6">
      <AvatarEditor user={me.user} onSaved={onSaved} />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="card space-y-4 p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setSt({ busy: true });
            try {
              await api("/me", { method: "PUT", body: { ...f, school_id: me.user.school_id } });
              setSt({ ok: "Dados atualizados." });
              onSaved();
            } catch (e: any) {
              setSt({ err: e.message, fields: e.fields });
            }
          }}
        >
          <h2 className="text-lg font-bold">Dados da conta</h2>
          {st.err && <Alert>{st.err}</Alert>}
          {st.ok && <Alert kind="success">{st.ok}</Alert>}
          <Field id="a-name" label="Nome completo" error={st.fields?.name}>
            <Input id="a-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} error={st.fields?.name} />
          </Field>
          <Field id="a-email" label="E-mail" hint="Para trocar o e-mail, fale com a equipe da escola.">
            <Input id="a-email" value={me.user.email} disabled className="bg-cream-2" />
          </Field>
          <Field id="a-phone" label="Telefone / WhatsApp" error={st.fields?.phone}>
            <Input id="a-phone" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: maskPhone(e.target.value) })} error={st.fields?.phone} />
          </Field>
          <button className="btn-primary" disabled={st.busy}>{st.busy ? "Salvando…" : "Salvar"}</button>
        </form>

        <form
          className="card space-y-4 p-6 lg:self-start"
          onSubmit={async (e) => {
            e.preventDefault();
            setPst({ busy: true });
            try {
              await api("/me/password", { method: "PUT", body: pw });
              setPst({ ok: true });
              setPw({ current: "", password: "" });
            } catch (e: any) {
              setPst({ err: e.message, fields: e.fields });
            }
          }}
        >
          <h2 className="text-lg font-bold">Trocar senha</h2>
          {pst.err && <Alert>{pst.err}</Alert>}
          {pst.ok && <Alert kind="success">Senha alterada.</Alert>}
          <Field id="p-cur" label="Senha atual" error={pst.fields?.current}>
            <Input id="p-cur" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} error={pst.fields?.current} />
          </Field>
          <Field id="p-new" label="Nova senha" hint="Mínimo de 8 caracteres." error={pst.fields?.password}>
            <Input id="p-new" type="password" autoComplete="new-password" value={pw.password} onChange={(e) => setPw({ ...pw, password: e.target.value })} error={pst.fields?.password} />
          </Field>
          <button className="btn-ghost" disabled={pst.busy}>Alterar senha</button>
        </form>
      </div>
    </div>
  );
}

type Cat = { id: number; name: string };

function ProfileTab({ me, onSaved, isWizard = false, onNext }: { me: Me; onSaved: () => void; isWizard?: boolean; onNext?: () => void }) {
  const cats = useApi<Cat[]>("/categories");
  const p = me.profile;
  const [f, setF] = useState({
    display_name: p?.display_name || me.user.name,
    profession: p?.profession || "",
    category_id: p?.category_id ? String(p.category_id) : "",
    bio: p?.bio || "",
    experience: p?.experience || "",
    city: p?.city || "",
    neighborhood: p?.neighborhood || "",
    service_area: p?.service_area || "",
    whatsapp: maskPhone(p ? p.whatsapp : me.user.phone),
    contact_hours: p?.contact_hours || "",
    price_range: p?.price_range || "",
    published: p ? !!p.published : true,
  });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; ok?: boolean; fields?: Record<string, string> }>({});
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const fe = st.fields || {};

  return (
    <div className={isWizard ? "max-w-4xl" : "grid gap-6 lg:grid-cols-[1.4fr_1fr]"}>
      <form
        className="card space-y-4 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setSt({ busy: true });
          try {
            await api("/me/profile", { method: "PUT", body: f });
            setSt({ ok: true });
            onSaved();
            if (isWizard) onNext?.();
          } catch (e: any) {
            setSt({ err: e.message, fields: e.fields });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-bold">{p ? "Editar perfil profissional" : "Criar meu perfil profissional"}</h2>
          {p && me.user.status === "approved" && f.published && !p.hidden_by_admin && (
            <Link to={`/profissionais/${p.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline">Ver perfil público <ExternalLink size={12} /></Link>
          )}
        </div>
        {!p && <p className="text-sm text-ink-soft">Preencha seus dados para aparecer no diretório. Seu perfil fica visível assim que a escola aprovar seu cadastro.</p>}
        {p && me.user.status !== "approved" && <Alert kind="warn">Seu perfil está salvo, mas só aparece no diretório depois que a escola aprovar seu cadastro.</Alert>}
        {p?.hidden_by_admin ? <Alert>Seu perfil foi ocultado pela moderação. Fale com a equipe da escola.</Alert> : null}
        {st.err && <Alert>{st.err}</Alert>}
        {st.ok && <Alert kind="success">Perfil salvo!</Alert>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pf-name" label="Nome de exibição" error={fe.display_name}>
            <Input id="pf-name" value={f.display_name} onChange={set("display_name")} error={fe.display_name} />
          </Field>
          <Field id="pf-prof" label="Profissão" error={fe.profession}>
            <Input id="pf-prof" placeholder="Ex.: Eletricista, Professora de inglês" value={f.profession} onChange={set("profession")} error={fe.profession} />
          </Field>
        </div>
        <Field id="pf-cat" label="Categoria principal" error={fe.category_id}>
          <select id="pf-cat" className={`input ${fe.category_id ? "input-error" : ""}`} value={f.category_id} onChange={set("category_id")}>
            <option value="">Selecione…</option>
            {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field id="pf-bio" label="Sobre você e seu trabalho" error={fe.bio}>
          <Textarea id="pf-bio" value={f.bio} onChange={set("bio")} error={fe.bio} placeholder="Conte o que você faz, há quanto tempo e o que te diferencia." />
        </Field>
        <Field id="pf-exp" label="Experiência (opcional)" error={fe.experience}>
          <Textarea id="pf-exp" rows={3} value={f.experience} onChange={set("experience")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pf-city" label="Cidade" error={fe.city}>
            <Input id="pf-city" value={f.city} onChange={set("city")} error={fe.city} />
          </Field>
          <Field id="pf-nb" label="Bairro (opcional)" hint="Não informe seu endereço residencial.">
            <Input id="pf-nb" value={f.neighborhood} onChange={set("neighborhood")} />
          </Field>
        </div>
        <Field id="pf-area" label="Região de atendimento (opcional)">
          <Input id="pf-area" placeholder="Ex.: Cotia e Carapicuíba" value={f.service_area} onChange={set("service_area")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pf-wa" label="WhatsApp para contato" error={fe.whatsapp} hint="Visível só para membros aprovados. Deixe vazio para não exibir.">
            <Input id="pf-wa" type="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: maskPhone(e.target.value) })} error={fe.whatsapp} />
          </Field>
          <Field id="pf-hours" label="Horário de atendimento (opcional)">
            <Input id="pf-hours" placeholder="Ex.: Seg a sex, 8h às 18h" value={f.contact_hours} onChange={set("contact_hours")} />
          </Field>
        </div>
        <Field id="pf-price" label="Faixa de preço (opcional)">
          <Input id="pf-price" placeholder="Ex.: a partir de R$ 80" value={f.price_range} onChange={set("price_range")} />
        </Field>
        <label className="flex items-center gap-2.5 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-brand" checked={f.published} onChange={(e) => setF({ ...f, published: e.target.checked })} />
          Exibir meu perfil no diretório
        </label>
        <button className="btn-primary" disabled={st.busy}>{st.busy ? "Salvando…" : p ? "Salvar alterações" : "Criar perfil"}</button>
      </form>

      {!isWizard && (
        <div className="space-y-6 lg:self-start">
          {p ? (
            <>
              <ServicesEditor services={me.services} onChange={onSaved} />
              <PortfolioEditor images={me.portfolio || []} onChange={onSaved} />
            </>
          ) : (
            <div className="card p-6 text-sm text-ink-soft">
              <h2 className="text-lg font-bold text-ink">Serviços e portfólio</h2>
              <p className="mt-2">Depois de criar seu perfil profissional, você poderá cadastrar seus serviços e adicionar fotos dos seus trabalhos ao portfólio.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ServicesEditor({ services, onChange }: { services: Service[]; onChange: () => void }) {
  const [edit, setEdit] = useState<Service | null>(null);
  const [f, setF] = useState({ title: "", description: "", price: "" });
  const [st, setSt] = useState<{ busy?: boolean; err?: string; fields?: Record<string, string> }>({});

  useEffect(() => {
    if (edit) { setF({ title: edit.title, description: edit.description, price: edit.price }); setSt({}); }
  }, [edit]);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">Serviços</h2>
        <button className="btn-ghost btn-sm" onClick={() => setEdit({ id: 0, title: "", description: "", price: "" })}><Plus size={14} /> Adicionar</button>
      </div>
      {services.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">Nenhum serviço cadastrado ainda.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {services.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="font-bold">{s.title}</p>
                {s.price && <p className="text-xs font-bold text-brand">{s.price}</p>}
                {s.description && <p className="mt-0.5 text-xs text-ink-soft">{s.description}</p>}
              </div>
              <div className="flex shrink-0 gap-1">
                <button className="rounded-full p-2 text-ink-soft hover:bg-cream-2" onClick={() => setEdit(s)} aria-label={`Editar ${s.title}`}><Pencil size={14} /></button>
                <button
                  className="rounded-full p-2 text-ink-soft hover:bg-red-50 hover:text-red-700"
                  aria-label={`Excluir ${s.title}`}
                  onClick={async () => { if (confirm(`Excluir o serviço "${s.title}"?`)) { await api(`/me/services/${s.id}`, { method: "DELETE" }); onChange(); } }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "Editar serviço" : "Novo serviço"}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setSt({ busy: true });
            try {
              await api(edit!.id ? `/me/services/${edit!.id}` : "/me/services", { method: edit!.id ? "PUT" : "POST", body: f });
              setEdit(null);
              onChange();
            } catch (e: any) {
              setSt({ err: e.message, fields: e.fields });
            }
          }}
        >
          {st.err && <Alert>{st.err}</Alert>}
          <Field id="s-title" label="Nome do serviço" error={st.fields?.title}>
            <Input id="s-title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} error={st.fields?.title} />
          </Field>
          <Field id="s-desc" label="Descrição (opcional)">
            <Textarea id="s-desc" rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          </Field>
          <Field id="s-price" label="Preço (opcional)">
            <Input id="s-price" placeholder="Ex.: R$ 120 ou a combinar" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} />
          </Field>
          <button className="btn-primary w-full" disabled={st.busy}>Salvar serviço</button>
        </form>
      </Modal>
    </div>
  );
}

function QuotesTab({ me, onChange }: { me: Me; onChange: () => void }) {
  return (
    <div className="space-y-8">
      {me.profile && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Recebidos</h2>
          {me.receivedQuotes.length === 0 ? (
            <Empty title="Nenhum pedido de orçamento ainda">Quando uma família pedir um orçamento pelo seu perfil, ele aparece aqui.</Empty>
          ) : (
            <ul className="space-y-3">
              {me.receivedQuotes.map((q) => (
                <li key={q.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">{q.family_name}</p>
                    <span className="flex items-center gap-1 text-xs text-ink-mute"><Clock size={12} /> {formatDate(q.created_at)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{q.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {q.family_phone && (
                      <a className="btn btn-sm bg-[#1f9d55] text-white hover:bg-[#188046]" target="_blank" rel="noreferrer" href={whatsappLink(q.family_phone, `Olá, ${q.family_name.split(" ")[0]}! Recebi seu pedido de orçamento pelo Conecta Escola.`)}>WhatsApp</a>
                    )}
                    <a className="btn-ghost btn-sm" href={`mailto:${q.family_email}`}>E-mail</a>
                    <select
                      aria-label="Situação do pedido"
                      className="input !w-auto !py-1.5 text-xs"
                      value={q.status}
                      onChange={async (e) => { await api(`/me/quotes/${q.id}`, { method: "PATCH", body: { status: e.target.value } }); onChange(); }}
                    >
                      {Object.entries(QUOTE_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <section>
        <h2 className="mb-3 text-lg font-bold">Enviados por mim</h2>
        {me.sentQuotes.length === 0 ? (
          <Empty title="Você ainda não pediu orçamentos" action={<Link to="/profissionais" className="btn-primary">Encontrar profissionais</Link>} />
        ) : (
          <ul className="space-y-3">
            {me.sentQuotes.map((q) => (
              <li key={q.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link to={`/profissionais/${q.slug}`} className="font-bold hover:text-brand">{q.display_name}</Link>
                  <span className="text-xs text-ink-mute">{formatDate(q.created_at)} · {QUOTE_STATUS[q.status]}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-soft">{q.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PartnershipsTab({ me }: { me: Me }) {
  const label: Record<string, string> = { active: "Ativa", closed: "Encerrada", hidden: "Oculta" };
  return me.partnerships.length === 0 ? (
    <Empty title="Nenhuma publicação no mural" action={<Link to="/parcerias" className="btn-primary">Ir para o mural</Link>}>Publique uma oportunidade de parceria para encontrar outros profissionais da comunidade.</Empty>
  ) : (
    <ul className="space-y-3">
      {me.partnerships.map((p) => (
        <li key={p.id} className="card flex items-center justify-between gap-3 p-4">
          <span className="font-bold">{p.title}</span>
          <span className="text-xs text-ink-soft">{label[p.status]} · {formatDate(p.created_at)}</span>
        </li>
      ))}
    </ul>
  );
}
