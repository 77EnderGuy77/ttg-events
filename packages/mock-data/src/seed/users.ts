import type { User } from '@ttg/types'

// ─── Demo accounts ──────────────────────────────────────────────────────────
export const DEMO_PLAYER: User = {
  id: 'usr-001',
  email: 'alex@example.com',
  name: 'Alex Johnson',
  role: 'player',
  createdAt: '2025-09-10T08:00:00Z',
}

export const DEMO_STORE_ADMIN: User = {
  id: 'usr-002',
  email: 'owner@dragonslair.com',
  name: 'Tomáš Drábek',
  role: 'store-admin',
  storeId: 'str-001',
  createdAt: '2025-08-01T08:00:00Z',
}

export const DEMO_TTG_ADMIN: User = {
  id: 'usr-003',
  email: 'internal@ttgevents.com',
  name: 'TTG Admin',
  role: 'ttg-admin',
  createdAt: '2025-01-01T00:00:00Z',
}

// ─── 60 players (usr-004 … usr-063) ─────────────────────────────────────────

const PLAYER_DATA: [string, string, string][] = [
  ['usr-004', 'Jan Novák', 'jan.novak@example.com'],
  ['usr-005', 'Petr Svoboda', 'petr.svoboda@example.com'],
  ['usr-006', 'Martin Kovář', 'martin.kovar@example.com'],
  ['usr-007', 'Jiří Procházka', 'jiri.prochazka@example.com'],
  ['usr-008', 'Pavel Kučera', 'pavel.kucera@example.com'],
  ['usr-009', 'Jakub Veselý', 'jakub.vesely@example.com'],
  ['usr-010', 'Lukáš Blažek', 'lukas.blazek@example.com'],
  ['usr-011', 'Ondřej Pospíšil', 'ondrej.pospisil@example.com'],
  ['usr-012', 'Tomáš Kratochvíl', 'tomas.kratochvil@example.com'],
  ['usr-013', 'David Horák', 'david.horak@example.com'],
  ['usr-014', 'Michal Dvořák', 'michal.dvorak@example.com'],
  ['usr-015', 'Radek Pokorný', 'radek.pokorny@example.com'],
  ['usr-016', 'Marek Nový', 'marek.novy@example.com'],
  ['usr-017', 'Adam Sedláček', 'adam.sedlacek@example.com'],
  ['usr-018', 'Václav Beneš', 'vaclav.benes@example.com'],
  ['usr-019', 'Filip Zeman', 'filip.zeman@example.com'],
  ['usr-020', 'Libor Horáček', 'libor.horacek@example.com'],
  ['usr-021', 'Stanislav Štěpánek', 'stanislav.stepanek@example.com'],
  ['usr-022', 'Roman Kolář', 'roman.kolar@example.com'],
  ['usr-023', 'Zdeněk Šimánek', 'zdenek.simanek@example.com'],
  ['usr-024', 'Lucie Nováková', 'lucie.novakova@example.com'],
  ['usr-025', 'Kateřina Marková', 'katerina.markova@example.com'],
  ['usr-026', 'Monika Horáková', 'monika.horakova@example.com'],
  ['usr-027', 'Jana Procházková', 'jana.prochazkova@example.com'],
  ['usr-028', 'Eva Šimánková', 'eva.simankova@example.com'],
  ['usr-029', 'Tereza Blažková', 'tereza.blazkova@example.com'],
  ['usr-030', 'Zuzana Pospíšilová', 'zuzana.pospisilova@example.com'],
  ['usr-031', 'Alena Kratochvílová', 'alena.kratochvilova@example.com'],
  ['usr-032', 'Věra Kovářová', 'vera.kovarova@example.com'],
  ['usr-033', 'Hana Dvořáková', 'hana.dvorakova@example.com'],
  ['usr-034', 'Ján Sloboda', 'jan.sloboda@example.com'],
  ['usr-035', 'Milan Kováč', 'milan.kovac@example.com'],
  ['usr-036', 'Peter Varga', 'peter.varga@example.com'],
  ['usr-037', 'Maroš Horváth', 'maros.horvath@example.com'],
  ['usr-038', 'Tomáš Krajčí', 'tomas.krajci@example.com'],
  ['usr-039', 'Matúš Oravec', 'matus.oravec@example.com'],
  ['usr-040', 'Jakub Šimko', 'jakub.simko@example.com'],
  ['usr-041', 'Rastislav Blaho', 'rastislav.blaho@example.com'],
  ['usr-042', 'Martin Kollár', 'martin.kollar@example.com'],
  ['usr-043', 'Miroslav Takáč', 'miroslav.takac@example.com'],
  ['usr-044', 'Vojtěch Fiala', 'vojtech.fiala@example.com'],
  ['usr-045', 'Přemysl Hora', 'premysl.hora@example.com'],
  ['usr-046', 'Dominik Šimáč', 'dominik.simac@example.com'],
  ['usr-047', 'Antonín Pospíšil', 'antonin.pospisil@example.com'],
  ['usr-048', 'Karel Vlček', 'karel.vlcek@example.com'],
  ['usr-049', 'Vladimír Procházek', 'vladimir.prochazek@example.com'],
  ['usr-050', 'Miloslav Beran', 'miloslav.beran@example.com'],
  ['usr-051', 'Zdeněk Ulrych', 'zdenek.ulrych@example.com'],
  ['usr-052', 'Miroslav Vácha', 'miroslav.vacha@example.com'],
  ['usr-053', 'Ladislav Mach', 'ladislav.mach@example.com'],
  ['usr-054', 'Richard Dobeš', 'richard.dobes@example.com'],
  ['usr-055', 'Barbora Jelínková', 'barbora.jelinkova@example.com'],
  ['usr-056', 'Simona Čermáková', 'simona.cermakova@example.com'],
  ['usr-057', 'Petra Havlíková', 'petra.havlikova@example.com'],
  ['usr-058', 'Ivana Říhová', 'ivana.rihova@example.com'],
  ['usr-059', 'Dana Malíková', 'dana.malikova@example.com'],
  ['usr-060', 'Lenka Pokorná', 'lenka.pokorna@example.com'],
  ['usr-061', 'Markéta Sedláčková', 'marketa.sedlackova@example.com'],
  ['usr-062', 'Veronika Nováčková', 'veronika.novackova@example.com'],
  ['usr-063', 'Denisa Mrázková', 'denisa.mrazkova@example.com'],
]

export const PLAYERS: User[] = PLAYER_DATA.map(([id, name, email]) => ({
  id,
  email,
  name,
  role: 'player',
  createdAt: '2026-01-15T10:00:00Z',
}))

export const USERS: User[] = [DEMO_PLAYER, DEMO_STORE_ADMIN, DEMO_TTG_ADMIN, ...PLAYERS]

/** IDs of the 60 regular players, for use in filler registrations */
export const PLAYER_IDS: string[] = PLAYER_DATA.map(([id]) => id)
