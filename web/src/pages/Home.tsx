import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  HeartHandshake,
  BriefcaseBusiness,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useApi, usePageTitle, useSite } from "../lib";
import { CategoryIcon, ProfessionalCard, type ProCard } from "../ui";

type Cat = { id: number; name: string; slug: string; icon: string; count: number };

export default function Home() {
  usePageTitle("");
  const { school } = useSite();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const cats = useApi<Cat[]>("/categories");
  const pros = useApi<{ items: ProCard[] }>("/professionals?ordem=recentes");
  const schoolName = school?.name || "nossa escola";

  return (
    <>
      {/* Apresentação principal */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-cream to-brand-50">
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-sky-100/60 blur-3xl" />

        <div className="container-x grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/10 bg-white px-4 py-2 text-xs font-bold text-brand shadow-sm">
              <Sparkles size={14} />
              Da escola para a comunidade
            </span>

            <h1 className="mt-7 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[60px]">
              Conexões que aproximam.
              <span className="mt-1 block text-brand">Oportunidades que transformam.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              O ConectaEscola aproxima famílias e profissionais da comunidade de {schoolName}, criando oportunidades e fortalecendo relações.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                nav(`/profissionais${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
              }}
              className="mt-8 flex max-w-[520px] items-center gap-2 rounded-2xl border border-line bg-white p-2 pl-4 shadow-pop"
              role="search"
            >
              <Search size={19} className="shrink-0 text-ink-mute" />
              <label htmlFor="home-q" className="sr-only">
                O que você está procurando?
              </label>
              <input
                id="home-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="O que você está procurando?"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-ink-mute"
              />
              <button className="btn-primary !rounded-xl !px-5 !py-3">
                Buscar <ArrowRight size={15} />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-ink-soft">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand" />
                Comunidade escolar
              </span>
              <span className="inline-flex items-center gap-2">
                <Users size={16} className="text-brand" />
                Conexões locais
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartHandshake size={16} className="text-brand" />
                Colaboração e oportunidades
              </span>
            </div>
          </div>

          {/* Destaque visual */}
          <div className="relative mx-auto w-full max-w-[430px] lg:ml-auto">
            <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full border-[18px] border-blue-100/70" />
            <div className="absolute -bottom-6 -left-5 h-32 w-32 rounded-full bg-sky-100/70 blur-xl" />

            <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-brand to-blue-800 p-6 shadow-pop sm:p-8">
              <div className="dots absolute inset-0 opacity-60" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white">
                    <HeartHandshake size={25} />
                  </div>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Nossa comunidade
                  </span>
                </div>

                <div className="mt-10 rounded-2xl bg-white p-6 shadow-card">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
                    {schoolName}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-ink">
                    Um lugar para conectar pessoas e oportunidades.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    Famílias, escola e profissionais construindo uma rede de apoio e colaboração.
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand">
                      <Users size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink">Juntos somos mais fortes</p>
                      <p className="text-xs text-ink-soft">Uma comunidade conectada.</p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-center text-xs font-medium text-white/80">
                  ConectaEscola · Conectando nossa comunidade
                </p>
              </div>
            </div>

           
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Encontre o que procura</p>
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                Explore as categorias
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Descubra os serviços disponíveis na nossa comunidade.
              </p>
            </div>

            <Link
              to="/categorias"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-brand transition hover:bg-brand-50"
            >
              Ver todas <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(cats.data || Array.from({ length: 6 }).map(() => null))
              .slice(0, 6)
              .map((c, i) =>
                c ? (
                  <Link
                    key={c.id}
                    to={`/profissionais?categoria=${c.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-pop"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 transition group-hover:bg-brand-light">
                      <CategoryIcon icon={c.icon} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">{c.name}</p>
                      <p className="mt-1 text-xs text-ink-soft">
                        {c.count} {c.count === 1 ? "profissional" : "profissionais"}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-ink-mute transition group-hover:translate-x-1 group-hover:text-brand"
                    />
                  </Link>
                ) : (
                  <div
                    key={i}
                    className="h-[82px] animate-pulse rounded-2xl border border-line bg-cream-2/60"
                  />
                )
              )}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-line bg-white py-16 sm:py-20">
        <div className="container-x">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow mb-2">Simples e conectado</p>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Uma rede feita para aproximar
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              O ConectaEscola facilita o contato entre pessoas da comunidade escolar e ajuda a criar novas oportunidades.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-cream p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                <Users size={23} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">Para as famílias</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Encontre profissionais e serviços indicados dentro da rede da comunidade escolar.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-cream p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                <BriefcaseBusiness size={23} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">Para profissionais</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Apresente seu trabalho, divulgue seus serviços e encontre novas oportunidades.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-cream p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand">
                <GraduationCap size={23} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">Para a escola</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Fortaleça os vínculos com as famílias e incentive a colaboração na comunidade.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/como-funciona"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
            >
              Saiba mais sobre o projeto <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Profissionais */}
      <section className="bg-cream-2 py-16 sm:py-20">
        <div className="container-x">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Conheça a rede</p>
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                Profissionais da comunidade
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Conheça quem faz parte dessa rede.
              </p>
            </div>

            <Link
              to="/profissionais"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-brand transition hover:bg-white"
            >
              Explorar diretório <ArrowRight size={15} />
            </Link>
          </div>

          {pros.data && pros.data.items.length === 0 ? (
            <div className="rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-card">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand">
                <BriefcaseBusiness size={25} />
              </div>
              <p className="mt-4 font-display text-xl font-bold text-ink">
                A rede está começando agora.
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Seja o primeiro profissional da comunidade a aparecer aqui.
              </p>
              <Link to="/cadastro?profissional=1" className="btn-primary mt-6">
                Cadastrar meu perfil <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(pros.data?.items || []).slice(0, 8).map((p) => (
                <ProfessionalCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Convite para profissionais */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-brand to-blue-800 px-7 py-10 shadow-pop sm:px-10 sm:py-12">
            <div className="dots absolute inset-0 -z-10 opacity-60" />
            <div className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/10" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-100">
                  <Sparkles size={13} />
                  Faça parte da rede
                </span>

                <h2 className="mt-5 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                  Seu trabalho merece ser conhecido.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                  Crie seu perfil, apresente seus serviços e conecte-se com famílias e oportunidades da comunidade escolar.
                </p>
              </div>

              <Link
                to="/cadastro?profissional=1"
                className="btn-mustard shrink-0 !rounded-xl !px-6 !py-3.5"
              >
                Quero participar <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
