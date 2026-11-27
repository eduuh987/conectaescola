
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  HeartHandshake,
  BriefcaseBusiness,
  GraduationCap,
  ChevronRight,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { useApi, usePageTitle, useSite } from "../lib";
import { CategoryIcon, ProfessionalCard, type ProCard } from "../ui";

type Cat = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  count: number;
};

export default function Home() {
  usePageTitle("");

  const { school } = useSite();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const cats = useApi<Cat[]>("/categories");
  const pros = useApi<{ items: ProCard[] }>(
    "/professionals?ordem=recentes"
  );

  const schoolName = school?.name || "E.E Vila São Joaquim II";
  const professionals = pros.data?.items || [];

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#F5F8FC]">
        <div className="pointer-events-none absolute -right-40 -top-48 h-[600px] w-[600px] rounded-full border border-blue-100/70" />
        <div className="pointer-events-none absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full border border-blue-100/70" />
        <div className="pointer-events-none absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-blue-100/30 blur-3xl" />

        <div className="container-x relative grid items-center gap-14 py-16 sm:py-20 lg:min-h-[610px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-24">
          {/* Conteúdo principal */}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold tracking-wide text-brand shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand" />
              UMA REDE QUE COMEÇA NA ESCOLA
            </div>

            <h1 className="mt-7 text-[42px] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink sm:text-6xl lg:text-[68px]">
              Talentos perto de você.
              <span className="mt-2 block text-brand">
                Oportunidades para todos.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-ink-soft sm:text-lg">
              Um espaço para aproximar famílias, profissionais e escola.
              Descubra serviços, conheça talentos e fortaleça os laços da
              nossa comunidade.
            </p>

            {/* Busca */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                nav(
                  `/profissionais${
                    q.trim()
                      ? `?q=${encodeURIComponent(q.trim())}`
                      : ""
                  }`
                );
              }}
              className="mt-9 flex max-w-[560px] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_35px_rgba(23,43,77,0.08)] transition focus-within:border-brand/50 focus-within:shadow-[0_12px_35px_rgba(23,43,77,0.13)]"
              role="search"
            >
              <Search
                size={21}
                className="ml-2 shrink-0 text-ink-mute"
              />

              <label htmlFor="home-q" className="sr-only">
                O que você está procurando?
              </label>

              <input
                id="home-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Qual serviço você procura?"
                className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-ink-mute sm:text-base"
              />

              <button className="btn-primary !rounded-xl !px-5 !py-3.5">
                Buscar <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-ink-soft sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-brand" />
                Ambiente de comunidade
              </span>

              <span className="inline-flex items-center gap-2">
                <HeartHandshake size={17} className="text-brand" />
                Conexões locais
              </span>
            </div>
          </div>

          {/* Destaque da comunidade */}
          <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto">
            <div className="absolute -right-5 -top-7 h-24 w-24 rounded-3xl bg-blue-100/70" />
            <div className="absolute -bottom-6 -left-5 h-28 w-28 rounded-full bg-sky-100/70" />

            <div className="relative rounded-[30px] border border-white bg-white p-5 shadow-[0_24px_70px_rgba(23,43,77,0.12)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                    Nossa comunidade
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    Pessoas que conectam.
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">
                    Conheça os profissionais e talentos que fazem parte
                    dessa rede.
                  </p>
                </div>

                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand">
                  <Users size={24} />
                </div>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              {professionals.length > 0 ? (
                <div className="grid gap-4">
                  {professionals.slice(0, 2).map((p) => (
                    <ProfessionalCard key={p.id} p={p} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-[#F5F8FC] p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-sm">
                    <BriefcaseBusiness size={23} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-ink">
                    Um espaço para novos talentos.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    A comunidade pode descobrir serviços, compartilhar
                    habilidades e criar novas oportunidades.
                  </p>
                  <Link
                    to="/profissionais"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"
                  >
                    Explorar profissionais <ArrowRight size={15} />
                  </Link>
                </div>
              )}

              <Link
                to="/profissionais"
                className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-blue-50/50"
              >
                Conhecer toda a rede
                <ArrowUpRight size={17} className="text-brand" />
              </Link>
            </div>

            <div className="relative mt-5 flex items-center gap-3 px-2">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
                <GraduationCap size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-ink">{schoolName}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Escola, famílias e comunidade em conexão.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                Explore possibilidades
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                O que você procura?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft sm:text-base">
                Encontre diferentes serviços e profissionais da nossa
                comunidade em um só lugar.
              </p>
            </div>

            <Link
              to="/categorias"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-ink transition hover:border-brand/40 hover:bg-blue-50"
            >
              Todas as categorias
              <ArrowUpRight size={16} className="text-brand" />
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
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(23,43,77,0.08)]"
                  >
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#EFF5FC] text-brand transition group-hover:bg-brand group-hover:text-white">
                      <CategoryIcon icon={c.icon} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-base font-bold text-ink">
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-soft">
                        {c.count}{" "}
                        {c.count === 1
                          ? "profissional disponível"
                          : "profissionais disponíveis"}
                      </p>
                    </div>

                    <ChevronRight
                      size={19}
                      className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-brand"
                    />
                  </Link>
                ) : (
                  <div
                    key={i}
                    className="h-[94px] animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                  />
                )
              )}
          </div>
        </div>
      </section>

      {/* CONVITE PARA PROFISSIONAIS */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20">
        <div className="container-x">
          <div className="relative isolate overflow-hidden rounded-[30px] bg-[#173B70] px-7 py-10 sm:px-12 sm:py-14 lg:px-16">
            <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border-[55px] border-white/[0.06]" />
            <div className="pointer-events-none absolute -bottom-44 right-1/3 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-9 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-blue-100">
                  <Sparkles size={14} />
                  Faça parte dessa iniciativa
                </span>

                <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Seu talento pode abrir novas portas.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/85 sm:text-base">
                  Apresente seu trabalho, divulgue seus serviços e
                  aproxime-se de famílias que fazem parte da comunidade
                  escolar.
                </p>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-blue-100/90 sm:text-sm">
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Apresente seus serviços
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Faça novas conexões
                  </span>
                </div>
              </div>

              <Link
                to="/cadastro?profissional=1"
                className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-extrabold text-[#173B70] shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
              >
                Quero participar
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container-x">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
              Simples e acessível
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Uma conexão que faz a diferença.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              O Conecta Escola aproxima pessoas e facilita a descoberta de
              serviços e oportunidades dentro da comunidade escolar.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(23,43,77,0.07)]">
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-brand">
                  <Users size={25} />
                </div>
                <span className="text-4xl font-extrabold text-slate-100">
                  01
                </span>
              </div>
              <h3 className="mt-7 text-lg font-bold text-ink">
                Para as famílias
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                Encontre profissionais, conheça serviços e descubra
                possibilidades dentro da rede da comunidade escolar.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(23,43,77,0.07)]">
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-brand">
                  <BriefcaseBusiness size={25} />
                </div>
                <span className="text-4xl font-extrabold text-slate-100">
                  02
                </span>
              </div>
              <h3 className="mt-7 text-lg font-bold text-ink">
                Para profissionais
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                Apresente suas habilidades, divulgue seu trabalho e
                aproxime-se de novas oportunidades.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(23,43,77,0.07)]">
              <div className="flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-brand">
                  <GraduationCap size={25} />
                </div>
                <span className="text-4xl font-extrabold text-slate-100">
                  03
                </span>
              </div>
              <h3 className="mt-7 text-lg font-bold text-ink">
                Para a escola
              </h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">
                Fortaleça os vínculos com as famílias e incentive a
                colaboração entre as pessoas da comunidade.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/como-funciona"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand transition hover:gap-3"
            >
              Entenda como o projeto funciona
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PROFISSIONAIS */}
      <section className="bg-[#F5F8FC] py-16 sm:py-20">
        <div className="container-x">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
                Talentos da nossa rede
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                Profissionais da comunidade
              </h2>
              <p className="mt-3 text-sm text-ink-soft sm:text-base">
                Conheça pessoas que têm muito a oferecer.
              </p>
            </div>

            <Link
              to="/profissionais"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink transition hover:border-brand/40 hover:text-brand"
            >
              Ver diretório
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {pros.data && professionals.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-brand">
                <BriefcaseBusiness size={28} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-ink">
                Nossa rede está começando.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Seja um dos primeiros profissionais a apresentar seu
                trabalho e fazer parte dessa comunidade.
              </p>
              <Link
                to="/cadastro?profissional=1"
                className="btn-primary mt-6"
              >
                Cadastrar meu perfil <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {professionals.slice(0, 8).map((p) => (
                <ProfessionalCard key={p.id} p={p} />
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-soft">
            <MapPin size={15} className="text-brand" />
            <span>Conexões que começam na comunidade escolar.</span>
          </div>
        </div>
      </section>

      {/* RODAPÉ DA PÁGINA */}
      <section className="border-t border-slate-200 bg-white py-8">
        <div className="container-x flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-brand">
              <GraduationCap size={19} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-ink">
                Conecta Escola
              </p>
              <p className="text-xs text-ink-soft">{schoolName}</p>
            </div>
          </div>

          <p className="text-xs text-ink-soft">
            Aproximando pessoas, talentos e oportunidades.
          </p>
        </div>
      </section>
    </>
  );
}
