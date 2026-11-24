# AutoVerse — Assembly Standard & Compatibility Rules (`ASSEMBLY_STANDARD.md`)

This standard defines the assembly validation rules, dynamic clearance sweeps, and compatibility states enforced across vehicle assemblies.

---

## 1. Assembly Compatibility States (§8)

Every component pairing or replacement is evaluated by the compatibility engine and assigned one of five strict states:

1. **`VALID`**: All mounting hardpoints match, minimum dynamic clearances are satisfied, and no geometric interpenetrations occur.
2. **`WARNING`**: Clearance is below optimal threshold (e.g. wheel-to-arch clearance between 5mm and 15mm during suspension bump). Assembly is physically possible but flags potential tire rubbing or thermal soak.
3. **`CONFLICT`**: Geometric collision or missing required mounting fastener. Assembly cannot be manufactured without modification. Blocks CFD simulation.
4. **`UNKNOWN`**: Insufficient dimensional or mounting metadata available to prove compatibility.
5. **`BLOCKED`**: Hard physical impossibility (e.g. part penetrates ground plane $Z < 0$, or circular dependency in parent hierarchy).

---

## 2. Dynamic Clearance Sweep Rules

- **Wheel & Tyre Clearance (`wheel↔arch`):**
  - Evaluated under static ride height, full suspension bump ($+50\text{mm}$), rebound ($-30\text{mm}$), and steering lock ($\pm 35^\circ$).
  - Minimum clearance: $15\text{mm}$.
- **Ground Clearance (`aero↔ground`):**
  - Minimum splitter track clearance: $30\text{mm}$. Any negative clearance ($Z < 0$) is flagged `BLOCKED`.
- **Powertrain Clearance (`engine↔hood`):**
  - Minimum engine envelope clearance to hood underside: $15\text{mm}$.
- **Mounting Dependency (`comp↔parent`):**
  - Every child component must reference a valid parent component and named anchor.
