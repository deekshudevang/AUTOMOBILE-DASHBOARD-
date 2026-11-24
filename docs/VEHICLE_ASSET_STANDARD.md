# AutoVerse — Vehicle Asset Standard (`VEHICLE_ASSET_STANDARD.md`)

This document defines the requirements for complete vehicle assets in AutoVerse.

---

## 1. Truth Contract & Provenance Classes

Every vehicle asset must declare its provenance class:

| Class | Definition | Usage Guidelines |
| :--- | :--- | :--- |
| **`manufacturer-CAD`** | Direct OEM engineering geometry obtained under official license. | Reserved for licensed CAD datasets. |
| **`licensed-mesh`** | Permissively licensed 3D model (CC0, CC-BY, MIT). | Must include author attribution and source URL. |
| **`photo-reconstruction`**| Reconstructed from orthographic blueprints and homologation specs. | Validated against published dimensions. |
| **`user-created`** | Custom design project created inside AutoVerse. | Full feature history DAG preserved. |
| **`procedural-placeholder`** | Algorithmic envelope for unverified catalog entries. | Displayed with explicit warning placard. |

---

## 2. Mandatory Sourced Specifications

Every reference vehicle must cite a verifiable source (manufacturer press kit, workshop manual, or homologation sheet) for all core dimensions:
- Overall Length ($L$)
- Overall Width ($W$)
- Overall Height ($H$)
- Wheelbase ($WB$)
- Front Track & Rear Track
- Ground Clearance
- Frontal Projected Area ($A_\text{frontal}$)
- Kerb Weight ($M$)
- Powertrain Layout & Engine Displacement

Fields that cannot be verified must be stored as `null` with notes rather than guessed.
