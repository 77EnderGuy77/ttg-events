import type { Registration, RegistrationStatus } from '@ttg/types'
import { PLAYER_IDS } from './users'

// ─── Helper ─────────────────────────────────────────────────────────────────

let _id = 1
function reg(
  eventId: string,
  userId: string,
  overrides: Partial<Omit<Registration, 'id' | 'eventId' | 'userId'>> = {},
): Registration {
  return {
    id: `reg-${String(_id++).padStart(3, '0')}`,
    eventId,
    userId,
    type: '1v1',
    status: 'registered',
    registeredAt: '2026-06-01T10:00:00Z',
    ...overrides,
  }
}

function fill(
  eventId: string,
  userIdSlice: string[],
  status: RegistrationStatus,
  baseDate = '2026-05-28T10:00:00Z',
): Registration[] {
  return userIdSlice.map((userId, i) =>
    reg(eventId, userId, {
      status,
      registeredAt: new Date(new Date(baseDate).getTime() + i * 3_600_000).toISOString(),
    }),
  )
}

const P = PLAYER_IDS // alias

// ─── Explicit demo registrations — all 9 states ──────────────────────────────
//
// State 1 — Registered 1v1        : Alex @ evt-003 (upcoming Sealed, Dragon's Lair)
// State 2 — Registered 2v2 Solo   : Alex @ evt-004 (upcoming 2HG,   Dragon's Lair)
// State 3 — Registered 2v2 Captain: usr-004 @ evt-004 (with teammate)
// State 4 — Waitlisted 1v1        : Alex @ evt-005 (full Sealed, Mythic Games Brno)
// State 5 — Waitlisted 2v2 Solo   : Alex @ evt-006 (full 2HG,   Mana Vault Brno)
// State 6 — Waitlisted 2v2 Team   : usr-006 @ evt-006 (team, waitlisted)
// State 7 — Checked In            : Alex @ evt-002 (active today, Dragon's Lair)
// State 8 — Attended              : Alex @ evt-001 (completed, Dragon's Lair)
// State 9 — Cancelled             : Alex @ evt-010 (completed, Critical Hit)

const DEMO_REGS: Registration[] = [
  // State 8: Attended
  reg('evt-001', 'usr-001', { status: 'attended', registeredAt: '2026-05-25T10:00:00Z', companionName: 'AlexJohnson' }),
  // State 7: Checked In
  reg('evt-002', 'usr-001', { status: 'checked-in', registeredAt: '2026-06-01T10:00:00Z', checkedInAt: '2026-06-16T13:45:00Z' }),
  // State 1: Registered 1v1
  reg('evt-003', 'usr-001', { type: '1v1', status: 'registered', registeredAt: '2026-06-02T09:00:00Z', companionName: 'AlexJohnson' }),
  // State 2: Registered 2v2 Solo
  reg('evt-004', 'usr-001', { type: '2v2-solo', status: 'registered', registeredAt: '2026-06-02T09:15:00Z' }),
  // State 3: Registered 2v2 Captain
  reg('evt-004', 'usr-004', { type: '2v2-team', teamRole: 'captain', teammateName: 'Petr Svoboda', status: 'registered', registeredAt: '2026-06-03T11:00:00Z' }),
  // State 4: Waitlisted 1v1
  reg('evt-005', 'usr-001', { type: '1v1', status: 'waitlisted', registeredAt: '2026-06-05T08:00:00Z' }),
  // State 5: Waitlisted 2v2 Solo
  reg('evt-006', 'usr-001', { type: '2v2-solo', status: 'waitlisted', registeredAt: '2026-06-05T08:10:00Z' }),
  // State 6: Waitlisted 2v2 Team
  reg('evt-006', 'usr-006', { type: '2v2-team', teamRole: 'captain', teammateName: 'Jiří Procházka', status: 'waitlisted', registeredAt: '2026-06-06T10:00:00Z' }),
  // State 9: Cancelled
  reg('evt-010', 'usr-001', { type: '1v1', status: 'cancelled', registeredAt: '2026-04-20T10:00:00Z' }),
]

// ─── Filler registrations per event ─────────────────────────────────────────

// evt-001 completed (28 total): Alex already counted → 27 filler
const EVT_001 = fill('evt-001', P.slice(0, 27), 'attended', '2026-05-24T10:00:00Z')

// evt-002 active (12 total): Alex already counted → 11 filler (mix checked-in / registered)
const EVT_002 = [
  ...fill('evt-002', P.slice(1, 7), 'checked-in', '2026-06-02T10:00:00Z'),
  ...fill('evt-002', P.slice(7, 12), 'registered', '2026-06-03T10:00:00Z'),
]

// evt-003 upcoming (18 total): Alex already counted → 17 filler registered
const EVT_003 = fill('evt-003', P.slice(3, 20), 'registered', '2026-06-02T10:00:00Z')

// evt-004 upcoming 2HG (6 total): Alex + usr-004 already counted → 4 filler
const EVT_004 = [
  reg('evt-004', P[10], { type: '2v2-team', teamRole: 'captain', teammateName: 'Ondřej Pospíšil', status: 'registered', registeredAt: '2026-06-03T14:00:00Z' }),
  reg('evt-004', P[11], { type: '2v2-solo', status: 'registered', registeredAt: '2026-06-04T10:00:00Z' }),
  reg('evt-004', P[12], { type: '2v2-solo', status: 'registered', registeredAt: '2026-06-05T10:00:00Z' }),
  reg('evt-004', P[13], { type: '2v2-team', teamRole: 'captain', teammateName: 'David Horák', status: 'registered', registeredAt: '2026-06-06T10:00:00Z' }),
]

// evt-005 FULL (24 registered + 8 waitlisted): Alex already waitlisted → 24 reg + 7 waitlist filler
const EVT_005 = [
  ...fill('evt-005', P.slice(15, 39), 'registered', '2026-05-28T10:00:00Z'),  // 24 registered
  ...fill('evt-005', P.slice(39, 46), 'waitlisted', '2026-06-04T10:00:00Z'), // 7 waitlisted (Alex is 8th)
]

// evt-006 FULL (16 registered + 4 waitlisted): Alex + usr-006 already counted → 16 reg + 2 waitlist filler
const EVT_006 = [
  ...fill('evt-006', P.slice(20, 36), 'registered', '2026-05-26T10:00:00Z'),  // 16 registered
  reg('evt-006', P[46], { type: '2v2-solo', status: 'waitlisted', registeredAt: '2026-06-06T11:00:00Z' }),
  reg('evt-006', P[47], { type: '2v2-solo', status: 'waitlisted', registeredAt: '2026-06-07T09:00:00Z' }),
]

// evt-007 upcoming Lorcana (12 registered)
const EVT_007 = fill('evt-007', P.slice(5, 17), 'registered', '2026-06-08T10:00:00Z')

// evt-008 upcoming Pokémon (15 registered)
const EVT_008 = fill('evt-008', P.slice(10, 25), 'registered', '2026-06-09T10:00:00Z')

// evt-009 upcoming MTG Draft (8 registered)
const EVT_009 = fill('evt-009', P.slice(18, 26), 'registered', '2026-06-10T10:00:00Z')

// evt-010 completed Pokémon Regional (20 attended): Alex cancelled → 20 filler attended
const EVT_010 = fill('evt-010', P.slice(25, 45), 'attended', '2026-04-18T10:00:00Z')

// evt-011 completed Yu-Gi-Oh (15 attended)
const EVT_011 = fill('evt-011', P.slice(30, 45), 'attended', '2026-05-08T10:00:00Z')

// evt-012 upcoming Dragon's Lair Tarkir Prerelease (12 registered)
const EVT_012 = fill('evt-012', P.slice(2, 14), 'registered', '2026-06-19T10:00:00Z')

// ─── Export ──────────────────────────────────────────────────────────────────

export const REGISTRATIONS: Registration[] = [
  ...DEMO_REGS,
  ...EVT_001,
  ...EVT_002,
  ...EVT_003,
  ...EVT_004,
  ...EVT_005,
  ...EVT_006,
  ...EVT_007,
  ...EVT_008,
  ...EVT_009,
  ...EVT_010,
  ...EVT_011,
  ...EVT_012,
]
