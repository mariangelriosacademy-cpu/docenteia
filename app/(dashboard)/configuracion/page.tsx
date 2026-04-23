"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

const createSupabase = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

interface Profile {
  id: string;
  nombre: string;
  email: string;
  pais: string;
  materias: string[];
  idioma: string;
  plan: "free" | "pro";
  plan_renovacion?: string;
  avatar_url?: string;
}

const PAISES = [
  "Argentina","Bolivia","Chile","Colombia","Costa Rica","Cuba",
  "Ecuador","El Salvador","España","Guatemala","Honduras","México",
  "Nicaragua","Panamá","Paraguay","Perú","República Dominicana",
  "Uruguay","Venezuela","Otro",
];

const MATERIAS_OPCIONES = [
  "Matemáticas","Lenguaje","Ciencias","Historia","Geografía",
  "Inglés","Arte","Música","Educación Física","Tecnología",
  "Filosofía","Química","Física","Biología","Economía","Otra",
];

const IDIOMAS = ["Español","Inglés","Portugués","Francés"];

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all bg-white";
const inputDisabledCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-400 text-sm bg-gray-50 cursor-not-allowed";

function Alert({ type, text }: { type: "ok" | "err"; text: string }) {
  return (
    <div className={`text-sm px-4 py-3 rounded-xl flex items-center gap-2 ${
      type === "ok"
        ? "bg-teal-50 text-teal-700 border border-teal-200"
        : "bg-red-50 text-red-700 border border-red-200"
    }`}>
      <span>{type === "ok" ? "✓" : "✕"}</span> {text}
    </div>
  );
}

function ModalPlanes({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Elige tu plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Plan actual</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Gratis</div>
            <div className="text-gray-500 text-sm mb-4">$0 / mes</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> 50 prompts con IA / mes</li>
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Hasta 3 clases</li>
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Planificaciones básicas</li>
              <li className="flex gap-2"><span className="text-gray-300 font-bold">✗</span> Sin exportación PDF</li>
            </ul>
            <div className="mt-5 w-full py-2 rounded-lg bg-gray-200 text-gray-500 text-sm text-center font-medium cursor-default">Plan actual</div>
          </div>
          <div className="border-2 border-indigo-500 rounded-xl p-5 bg-indigo-50 relative">
            <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">⚡ Pro</div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">Recomendado</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">Pro</div>
            <div className="text-gray-500 text-sm mb-4">$9.99 / mes</div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Prompts ilimitados con IA</li>
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Clases ilimitadas</li>
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Exportación PDF / Word</li>
              <li className="flex gap-2"><span className="text-teal-500 font-bold">✓</span> Soporte prioritario</li>
            </ul>
            <button className="mt-5 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
              Mejorar a Pro →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalEliminar({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [texto, setTexto] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-red-200">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-red-700">⚠️ Eliminar cuenta</h2>
          <p className="text-red-600 text-sm mt-0.5">Esta acción es permanente e irreversible.</p>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm">Se eliminarán todos tus datos: clases, planificaciones, evaluaciones y perfil.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Escribe <span className="text-red-600 font-mono font-bold">CONFIRMAR</span> para continuar:
            </label>
            <input
              type="text"
              value={texto}
              onChange={e => setTexto(e.target.value)}
              placeholder="CONFIRMAR"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400 transition-all"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={texto !== "CONFIRMAR"}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const supabase = createSupabase();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [materias, setMaterias] = useState<string[]>([]);
  const [idioma, setIdioma] = useState("Español");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoMsg, setInfoMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [showPlanes, setShowPlanes] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setNombre(data.nombre || "");
        setPais(data.pais || "");
        setMaterias(data.materias || []);
        setIdioma(data.idioma || "Español");
        setAvatarUrl(data.avatar_url || null);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file || !user) return;
  setUploadingAvatar(true);
  const ext = file.name.split(".").pop();
  const path = `avatars/${user.id}.${ext}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  
  console.log("Upload result:", uploadData, uploadError);
  
  if (!uploadError) {
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    console.log("Public URL:", data.publicUrl);
    const url = data.publicUrl + "?t=" + Date.now();
    const { error: updateError } = await supabase.from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);
    console.log("Profile update error:", updateError);
    setAvatarUrl(url);
  }
  setUploadingAvatar(false);
}

  async function handleGuardarInfo() {
    if (!user) return;
    setSavingInfo(true);
    setInfoMsg(null);
    const { error } = await supabase.from("profiles").update({ nombre, pais, materias, idioma }).eq("id", user.id);
    setInfoMsg(error
      ? { type: "err", text: "Error al guardar. Intenta de nuevo." }
      : { type: "ok", text: "Cambios guardados correctamente." }
    );
    setSavingInfo(false);
    setTimeout(() => setInfoMsg(null), 3000);
  }

  async function handleCambiarPass() {
    if (newPass !== confirmPass) { setPassMsg({ type: "err", text: "Las contraseñas no coinciden." }); return; }
    if (newPass.length < 6) { setPassMsg({ type: "err", text: "Mínimo 6 caracteres." }); return; }
    setSavingPass(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPassMsg(error
      ? { type: "err", text: "Error al actualizar contraseña." }
      : { type: "ok", text: "Contraseña actualizada correctamente." }
    );
    setSavingPass(false);
    if (!error) { setNewPass(""); setConfirmPass(""); }
    setTimeout(() => setPassMsg(null), 3000);
  }

  function toggleMateria(m: string) {
    setMaterias(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }

  async function handleEliminarCuenta() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  const iniciales = nombre.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const esPro = profile?.plan === "pro";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {showPlanes && <ModalPlanes onClose={() => setShowPlanes(false)} />}
      {showEliminar && <ModalEliminar onClose={() => setShowEliminar(false)} onConfirm={handleEliminarCuenta} />}

      <div className="max-w-2xl mx-auto space-y-5">

        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-500 text-sm mt-1">Administra tu perfil, plan y seguridad.</p>
        </div>

        {/* 1. Información personal */}
        <SectionCard title="Información personal" icon="👤">
          <div className="flex items-center gap-5 pb-2">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl border-2 border-indigo-200 shadow">
                  {iniciales}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition-colors"
                title="Cambiar foto"
              >
                {uploadingAvatar ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{nombre || "Tu nombre"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 transition-colors">
                Cambiar foto de perfil
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <Field label="Nombre completo">
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo" className={inputCls} />
            </Field>

            <Field label="Correo electrónico">
              <input type="email" value={user?.email || ""} readOnly className={inputDisabledCls} />
              <p className="text-xs text-gray-400 mt-1">El email no puede modificarse aquí.</p>
            </Field>

            <Field label="País">
              <select value={pais} onChange={e => setPais(e.target.value)} className={inputCls}>
                <option value="">Seleccionar país</option>
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <Field label="Materias que enseñas">
              <div className="flex flex-wrap gap-2 mt-1">
                {MATERIAS_OPCIONES.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMateria(m)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      materias.includes(m)
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-white border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Idioma preferido">
              <select value={idioma} onChange={e => setIdioma(e.target.value)} className={inputCls}>
                {IDIOMAS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
          </div>

          {infoMsg && <Alert type={infoMsg.type} text={infoMsg.text} />}

          <button
            onClick={handleGuardarInfo}
            disabled={savingInfo}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 shadow-sm"
          >
            {savingInfo ? "Guardando..." : "Guardar cambios"}
          </button>
        </SectionCard>

        {/* 2. Plan actual */}
        <SectionCard title="Plan actual" icon={esPro ? "⚡" : "🎓"}>
          <div className={`rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap ${
            esPro ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 border border-gray-200"
          }`}>
            <div>
              <div className={`text-2xl font-bold ${esPro ? "text-indigo-700" : "text-gray-900"}`}>
                {esPro ? "Pro" : "Gratis"}
              </div>
              {esPro && profile?.plan_renovacion && (
                <p className="text-sm text-gray-500 mt-0.5">Renueva el {new Date(profile.plan_renovacion).toLocaleDateString("es")}</p>
              )}
              {!esPro && <p className="text-sm text-gray-500 mt-0.5">50 prompts · 3 clases incluidas</p>}
            </div>
            {!esPro ? (
              <button
                onClick={() => setShowPlanes(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm whitespace-nowrap"
              >
                ⚡ Mejorar a Pro
              </button>
            ) : (
              <span className="px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold border border-indigo-200">✓ Plan activo</span>
            )}
          </div>
        </SectionCard>

        {/* 3. Seguridad */}
        <SectionCard title="Seguridad" icon="🔒">
          <p className="text-sm text-gray-500 -mt-2">Cambia tu contraseña de acceso.</p>

          <Field label="Nueva contraseña">
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mínimo 6 caracteres" className={inputCls} />
          </Field>

          <Field label="Confirmar contraseña">
            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repite la nueva contraseña" className={inputCls} />
          </Field>

          {passMsg && <Alert type={passMsg.type} text={passMsg.text} />}

          <button
            onClick={handleCambiarPass}
            disabled={savingPass || !newPass || !confirmPass}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:opacity-40 shadow-sm"
          >
            {savingPass ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </SectionCard>

        {/* 4. Zona de peligro */}
        <section className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <h2 className="text-base font-semibold text-red-700 flex items-center gap-2 mb-1">⚠️ Zona de peligro</h2>
          <p className="text-sm text-red-600/80 mb-4">
            Eliminar tu cuenta borrará permanentemente todos tus datos, clases y planificaciones. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={() => setShowEliminar(true)}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-red-600 hover:text-white text-red-600 font-semibold text-sm border border-red-300 transition-all shadow-sm"
          >
            Eliminar mi cuenta
          </button>
        </section>

      </div>
    </>
  );
}