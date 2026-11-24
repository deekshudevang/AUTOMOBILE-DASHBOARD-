# AUTOVERSE 3D — Vehicle Modification & Slot Mapping Guide

## 1. Overview of Tuning Slots (mod0 to mod49)

In GTA V and Cherax Entity specifications, vehicles support up to 50 individual modification slots indexed from `mod0` through `mod49`. Each slot specifies:
- `index`: integer representing the selected tuning option (where `0` or `-1` is typically stock factory, and `> 0` represents aftermarket parts).
- `variation`: boolean flag indicating whether secondary model sub-variations or textures are enabled.

---

## 2. Complete Mod Slot Reference Table

| Mod Slot | Tuning Component Name | Category | Real-World Automotive Equivalent | 3D Visual Effect in AUTOVERSE 3D |
| :--- | :--- | :--- | :--- | :--- |
| `mod0` | Rear Spoiler / Wing | Aero & Bodywork | GT Wing, Carbon Ducktail, Lip Spoiler | Adjusts rear spoiler geometry, upright height, and endplates |
| `mod1` | Front Bumper | Aero & Bodywork | Front Splitter, Carbon Canards, Air Dam | Extends front lower carbon aero splitter and canards |
| `mod2` | Rear Bumper | Aero & Bodywork | Rear Aero Diffuser, Underbody Apron | Mounts deep rear racing diffuser and vertical aero fins |
| `mod3` | Side Skirts | Aero & Bodywork | Ground-Effect Rocker Blades | Mounts carbon ground blade extensions beneath sills |
| `mod4` | Exhaust System | Aero & Bodywork | Titanium Quad Tips, Race Mufflers | Switches dual chrome tips to quad burnt titanium pipes |
| `mod5` | Rollcage & Chassis | Interior & Cockpit | FIA Track Half-Cage / Full Rollcage | Renders interior tubular rollcage in secondary color |
| `mod6` | Front Grille | Exterior Styling | Badgeless Honeycomb Racing Grille | Swaps front grille mesh design |
| `mod7` | Hood & Bonnet | Aero & Bodywork | Vented Carbon Induction Hood | Mounts vented cowl induction hood with carbon slats |
| `mod8` | Left Fender | Aero & Bodywork | Bolt-On Widebody Fender Flares | Widens wheel arch stance |
| `mod9` | Right Fender | Aero & Bodywork | Bolt-On Widebody Fender Flares | Matches right side widebody flare |
| `mod10` | Roof & Scoop | Exterior Styling | Dry Carbon Roof Skin / Air Scoop | Mounts top aerodynamic carbon roof air scoop |
| `mod11` | Engine Tuning | Performance | ECU Stage 4 Race Remap | Performance telemetry parameter |
| `mod12` | Brake System | Performance | Slotted Rotors & Monoblock Calipers | Performance telemetry parameter |
| `mod13` | Transmission | Performance | 7-Speed Dual Clutch Sequential | Performance telemetry parameter |
| `mod14` | Horn | Exterior Styling | Custom Tone Generator | Acoustic parameter |
| `mod15` | Suspension & Stance | Wheels & Stance | Adjustable Track Coilovers | Dynamically lowers chassis ride height in real time |
| `mod16` | Chassis Armor | Performance | Ballistic Kevlar Reinforcement | Performance telemetry parameter |
| `mod18` | Turbocharger Kit | Performance | Twin Ceramic Ball-Bearing Turbos | Performance telemetry parameter |
| `mod20` | Tyre Smoke FX | Wheels & Stance | Colored Particulate Burnout Smoke | Physics and particulate color parameter |
| `mod22` | Xenon Headlights | Lighting | High-Intensity Xenon / Laser Projectors | Changes headlight beam color (Cyan, Blue, Mint, Amber, Pink) |
| `mod23` | Front Wheels | Wheels & Stance | Forged Modular / Monoblock Rims | Customizes rim geometry and multi-spoke face |
| `mod24` | Rear Wheels | Wheels & Stance | Staggered Rear Racing Wheels | Bike / Drag wheel customization |
| `mod25` | Plate Holder | Exterior Styling | Angled Carbon Frame / Plate Delete | Modifies license plate frame |
| `mod27` | Trim Design | Interior & Cockpit | Alcantara Dashboard Inserts | Custom interior trim styling |
| `mod32` | Racing Seats | Interior & Cockpit | Carbon Bucket Seats with 5-pt Harness | Renders cockpit racing seats with custom interior color |
| `mod33` | Steering Wheel | Interior & Cockpit | Flat-Bottom Alcantara Competition Wheel | Cockpit steering wheel styling |
| `mod48` | Livery & Decals | Cosmetic & Livery | Motorsport Sponsor Wrap, GT Stripes | Applies twin racing stripes in secondary paint |

