
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Shield,
  User as UserIcon,
  X,
} from "lucide-react";
import { api, useAuth, useSite } from "./lib";
import { Logo } from "./ui";

const NAV = [
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/categorias", label: "Categorias" },
  { to: "/profissionais", label: "Profissionais" },
  { to: "/parcerias", label: "Procurar parcerias" },
  { to: "/contato", label: "Contato" },
];

const PARTNERSHIPS_DESCRIPTION =
  "Na área de Parcerias, profissionais podem divulgar projetos, encontrar pessoas interessadas em colaborar e formar novas parcerias.";

type NotificationsResponse = {
  notifications: {
    id: number;
    type: string;
    title: string;
    message: string;
    link: string;
    related_type: string;
    related_id: number | null;
    is_read: number;
    created_at: string;
  }[];
  unread: number;
};

function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unread, setUnread] = useState(0);
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }

    let active = true;

    const loadNotifications = async () => {
      try {
        const result = await api<NotificationsResponse>("/me/notifications");
        if (active) setUnread(Number(result.unread || 0));
      } catch {
        // Mantém o cabeçalho funcionando mesmo se a consulta falhar.
      }
    };

    loadNotifications();

    const interval = window.setInterval(loadNotifications, 30000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user?.id]);

  const doLogout = async () => {
    await logout();
    nav("/");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `text-[13px] font-medium transition hover:text-brand ${
      isActive ? "text-brand" : "text-ink-soft"
    }`;

  const NotificationLink = ({ mobile = false }: { mobile?: boolean }) => (
    <Link
      to="/minha-conta?aba=orcamentos"
      aria-label={`Notificações${unread > 0 ? `: ${unread} não lidas` : ""}`}
      title={unread > 0 ? `${unread} notificações não lidas` : "Notificações"}
      className={
        mobile
          ? "btn-ghost flex items-center justify-center gap-2"
          : "relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition hover:bg-cream-2 hover:text-brand"
      }
    >
      <Bell size={mobile ? 17 : 18} />
      {unread > 0 && (
        <>
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 ring-2 ring-cream" />
          <span className="sr-only">{unread} notificações não lidas</span>
          {!mobile && (
            <span className="absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
          {mobile && (
            <span className="text-xs font-bold text-red-600">
              {unread > 99 ? "99+" : unread} não lidas
            </span>
          )}
        </>
      )}
      {mobile && unread === 0 && <span>Notificações</span>}
    </Link>
  );

  return (
    <header
      className={`sticky top-0 z-40 bg-cream/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_#E7E2D8]" : ""
      }`}
    >
      <div className="container-x flex h-[60px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {NAV.map((n) =>
            n.to === "/parcerias" ? (
              <div key={n.to} className="group relative py-5">
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 text-[13px] font-medium transition hover:text-brand ${
                      isActive ? "text-brand" : "text-ink-soft"
                    }`
                  }
                  aria-haspopup="true"
                >
                  {n.label}
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </NavLink>

                <div className="invisible absolute left-1/2 top-full z-[100] w-80 -translate-x-1/2 -translate-y-2 pt-2 opacity-0 transition-all duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="rounded-2xl border border-line bg-white p-5 text-left shadow-xl">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                        <UserIcon size={17} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink">
                          Como funcionam as parcerias?
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-mute">
                          Colaboração e oportunidades
                        </p>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed text-ink-soft">
                      {PARTNERSHIPS_DESCRIPTION}
                    </p>

                    <Link
                      to="/parcerias"
                      className="mt-4 flex items-center justify-between rounded-xl bg-cream-2 px-4 py-3 text-xs font-bold text-brand transition hover:bg-brand hover:text-white"
                    >
                      Explorar parcerias
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={n.to} to={n.to} className={linkCls}>
                {n.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <NotificationLink />

              {user.is_admin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink hover:text-brand"
                >
                  <Shield size={14} /> Admin
                </Link>
              )}

              <Link to="/minha-conta" className="btn-primary btn-sm !px-4 !py-2">
                <UserIcon size={14} /> {user.name.split(" ")[0]}
              </Link>

              <button
                onClick={doLogout}
                className="rounded-full p-2 text-ink-soft hover:bg-cream-2"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/entrar"
                className="px-2 text-[13px] font-bold text-ink hover:text-brand"
              >
                Entrar
              </Link>
              <Link to="/cadastro" className="btn-primary btn-sm !px-4 !py-2">
                Criar conta
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-full p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-cream lg:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Menu móvel">
            {NAV.map((n) => (
              <div key={n.to}>
                <NavLink
                  to={n.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-2 py-3 text-[15px] font-medium ${
                      isActive ? "text-brand" : "text-ink"
                    }`
                  }
                >
                  {n.label}
                </NavLink>

                {n.to === "/parcerias" && (
                  <div className="mx-2 mb-3 rounded-xl border border-line bg-white p-3">
                    <p className="text-xs leading-relaxed text-ink-soft">
                      {PARTNERSHIPS_DESCRIPTION}
                    </p>
                    <Link
                      to="/parcerias"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand"
                    >
                      Explorar parcerias <ArrowUpRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-4">
              {user ? (
                <>
                  <NotificationLink mobile />

                  {user.is_admin && (
                    <Link to="/admin" className="btn-ghost">
                      Administração
                    </Link>
                  )}

                  <Link to="/minha-conta" className="btn-primary">
                    Minha conta
                  </Link>

                  <button onClick={doLogout} className="btn-ghost">
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/cadastro" className="btn-primary">
                    Criar conta
                  </Link>
                  <Link to="/entrar" className="btn-ghost">
                    Entrar
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { school } = useSite();
  const schoolName = school?.name || "escola";

  return (
    <footer className="mt-auto border-t border-line bg-cream-2/60">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink-soft">
            Um espaço para famílias e profissionais da {schoolName} se
            encontrarem e colaborarem.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4 !text-[10px]">Explore</p>
          <ul className="space-y-2.5 text-xs font-medium text-ink-soft">
            <li>
              <Link to="/categorias" className="hover:text-brand">
                Categorias
              </Link>
            </li>
            <li>
              <Link to="/profissionais" className="hover:text-brand">
                Profissionais
              </Link>
            </li>
            <li>
              <Link to="/parcerias" className="hover:text-brand">
                Procurar parcerias
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4 !text-[10px]">Conecta Escola</p>
          <ul className="space-y-2.5 text-xs font-medium text-ink-soft">
            <li>
              <Link to="/como-funciona" className="hover:text-brand">
                Como funciona
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="inline-flex items-center gap-1 hover:text-brand"
              >
                Fale com a equipe <ArrowUpRight size={11} />
              </Link>
            </li>
            <li>
              <Link to="/cadastro" className="hover:text-brand">
                Criar conta
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="hover:text-brand">
                Termos e privacidade
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-1 border-t border-line py-5 text-[11px] text-ink-mute sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Conecta Escola</span>
        <span>Uma rede comunitária da {schoolName}</span>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
