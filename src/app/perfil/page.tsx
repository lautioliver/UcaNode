import { updatePerfil } from "@/lib/actions";
import { AppHeader, SectionCard } from "@/components/layout";
import { prisma } from "@/lib/prisma";

export default async function PerfilPage() {
  const perfil = await prisma.perfil.findFirst();

  return (
    <main className="space-y-6">
      <AppHeader perfilNombre={perfil?.nombre} />

      <div>
        <h1 className="text-2xl font-semibold">Usuario Ucasal</h1>
        <p className="text-sm text-zinc-500">
          Tu perfil de estudiante de Ingeniería Informática.
        </p>
      </div>

      <SectionCard title="Datos personales">
        <form action={updatePerfil} className="grid max-w-lg gap-3">
          <input
            name="nombre"
            required
            defaultValue={perfil?.nombre ?? ""}
            placeholder="Nombre completo"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="emailUcasal"
            type="email"
            required
            defaultValue={perfil?.emailUcasal ?? ""}
            placeholder="email@ucasal.edu.ar"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="carrera"
            required
            defaultValue={perfil?.carrera ?? "Ingeniería Informática"}
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="anioIngreso"
            type="number"
            required
            defaultValue={perfil?.anioIngreso ?? new Date().getFullYear()}
            placeholder="Año de ingreso"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <input
            name="legajo"
            defaultValue={perfil?.legajo ?? ""}
            placeholder="Legajo (opcional)"
            className="rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Guardar perfil
          </button>
        </form>
      </SectionCard>
    </main>
  );
}
