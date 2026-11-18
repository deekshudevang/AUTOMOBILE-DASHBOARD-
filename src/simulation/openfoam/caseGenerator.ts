import fs from 'fs';
import path from 'path';
import { AhmedBodyGenerator, DEFAULT_AHMED_25, DEFAULT_AHMED_35, AhmedBodyDimensions } from '../../geometry/benchmarks/ahmedBodyGenerator';

export interface OpenFoamCaseConfig {
  caseName: string;
  outputDir: string;
  slantAngleDeg: number;
  freestreamVelocity: number; // m/s, default 40.0
  airDensity: number;         // kg/m3, default 1.205
  airKinematicViscosity: number; // m2/s, default 1.5e-5
  maxIterations: number;      // default 500
  cores: number;              // default 4
}

export const DEFAULT_CASE_CONFIG_25: OpenFoamCaseConfig = {
  caseName: 'ahmed_body_25deg',
  outputDir: 'simulations/ahmed_body_25deg',
  slantAngleDeg: 25.0,
  freestreamVelocity: 40.0,
  airDensity: 1.205,
  airKinematicViscosity: 1.5e-5,
  maxIterations: 500,
  cores: 4
};

export const DEFAULT_CASE_CONFIG_35: OpenFoamCaseConfig = {
  caseName: 'ahmed_body_35deg',
  outputDir: 'simulations/ahmed_body_35deg',
  slantAngleDeg: 35.0,
  freestreamVelocity: 40.0,
  airDensity: 1.205,
  airKinematicViscosity: 1.5e-5,
  maxIterations: 500,
  cores: 4
};

/**
 * Standardized OpenFOAM Case Generator for Aerodynamic Verification
 * Generates verified OpenFOAM v10 / v11 / v2406 case directories.
 */
export class OpenFoamCaseGenerator {
  public static generateCase(config: OpenFoamCaseConfig = DEFAULT_CASE_CONFIG_25): {
    caseDir: string;
    filesGenerated: string[];
    geometryMetrics: any;
  } {
    const caseDir = path.resolve(process.cwd(), config.outputDir);
    const dir0 = path.join(caseDir, '0');
    const dirConstant = path.join(caseDir, 'constant');
    const dirTriSurface = path.join(dirConstant, 'triSurface');
    const dirSystem = path.join(caseDir, 'system');

    // Create directories
    [caseDir, dir0, dirConstant, dirTriSurface, dirSystem].forEach(d => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    const filesGenerated: string[] = [];
    const writeFile = (filePath: string, content: string) => {
      fs.writeFileSync(filePath, content.trim() + '\n', 'utf-8');
      filesGenerated.push(filePath);
    };

    // 1. Export Geometry STL
    const params = config.slantAngleDeg === 35.0 ? DEFAULT_AHMED_35 : DEFAULT_AHMED_25;
    const geo = AhmedBodyGenerator.generateGeometry(params);
    const stlContent = AhmedBodyGenerator.exportToSTL(geo, 'ahmed_body');
    const stlPath = path.join(dirTriSurface, 'ahmed_body.stl');
    writeFile(stlPath, stlContent);

    const metrics = AhmedBodyGenerator.getMetrics(config.slantAngleDeg);

    // 2. Initial & Boundary Condition Fields (0/)
    writeFile(path.join(dir0, 'U'), this.getUFile(config.freestreamVelocity));
    writeFile(path.join(dir0, 'p'), this.getPFile());
    writeFile(path.join(dir0, 'k'), this.getKFile(config.freestreamVelocity));
    writeFile(path.join(dir0, 'omega'), this.getOmegaFile(config.freestreamVelocity));
    writeFile(path.join(dir0, 'nut'), this.getNutFile());

    // 3. Constant Dictionaries (constant/)
    writeFile(path.join(dirConstant, 'transportProperties'), this.getTransportProperties(config.airKinematicViscosity));
    writeFile(path.join(dirConstant, 'turbulenceProperties'), this.getTurbulenceProperties());

    // 4. System Dictionaries (system/)
    writeFile(path.join(dirSystem, 'controlDict'), this.getControlDict(config, metrics.frontalAreaM2));
    writeFile(path.join(dirSystem, 'blockMeshDict'), this.getBlockMeshDict(params));
    writeFile(path.join(dirSystem, 'snappyHexMeshDict'), this.getSnappyHexMeshDict());
    writeFile(path.join(dirSystem, 'fvSchemes'), this.getFvSchemes());
    writeFile(path.join(dirSystem, 'fvSolution'), this.getFvSolution());
    writeFile(path.join(dirSystem, 'decomposeParDict'), this.getDecomposeParDict(config.cores));

    // 5. Automated Shell Execution Scripts
    writeFile(path.join(caseDir, 'Allrun'), this.getAllrunScript(config.cores));
    writeFile(path.join(caseDir, 'Allclean'), this.getAllcleanScript());

    // 6. Manifest / Metadata for AutoVerse 3D
    const manifest = {
      caseName: config.caseName,
      slantAngleDeg: config.slantAngleDeg,
      freestreamVelocity: config.freestreamVelocity,
      frontalAreaM2: metrics.frontalAreaM2,
      literatureReferenceCd: metrics.nominalDragCoefficientLiterature,
      literatureSource: metrics.literatureSource,
      solver: 'simpleFoam (OpenFOAM Foundation / ESI-OpenCFD)',
      turbulenceModel: 'kOmegaSST',
      provenance: 'CFD_CASE_BUNDLE',
      createdAt: new Date().toISOString()
    };
    writeFile(path.join(caseDir, 'case_manifest.json'), JSON.stringify(manifest, null, 2));

    return { caseDir, filesGenerated, geometryMetrics: metrics };
  }

  private static getHeader(objectName: string, className: string = 'dictionary'): string {
    return `/*--------------------------------*- C++ -*----------------------------------*\\
| =========                 |                                                 |
| \\\\      /  F ield         | OpenFOAM: The Open Source CFD Toolbox           |
|  \\\\    /   O peration     | Version:  v2406 / 11                            |
|   \\\\  /    A nd           | Web:      www.OpenFOAM.com                      |
|    \\\\/     M anipulation  | AutoVerse 3D Verified Case Generator            |
\\*---------------------------------------------------------------------------*/
FoamFile
{
    version     2.0;
    format      ascii;
    class       ${className};
    location    "";
    object      ${objectName};
}
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //`;
  }

  private static getUFile(U: number): string {
    return `${this.getHeader('U', 'volVectorField')}

dimensions      [0 1 -1 0 0 0 0];
internalField   uniform (${U.toFixed(1)} 0 0);

boundaryField
{
    inlet
    {
        type            fixedValue;
        value           uniform (${U.toFixed(1)} 0 0);
    }
    outlet
    {
        type            zeroGradient;
    }
    ground
    {
        type            fixedValue;
        value           uniform (${U.toFixed(1)} 0 0); // Moving road at vehicle speed
    }
    topAndSides
    {
        type            slip;
    }
    ahmed_body
    {
        type            noSlip;
    }
}`;
  }

  private static getPFile(): string {
    return `${this.getHeader('p', 'volScalarField')}

dimensions      [0 2 -2 0 0 0 0];
internalField   uniform 0;

boundaryField
{
    inlet
    {
        type            zeroGradient;
    }
    outlet
    {
        type            fixedValue;
        value           uniform 0;
    }
    ground
    {
        type            zeroGradient;
    }
    topAndSides
    {
        type            zeroGradient;
    }
    ahmed_body
    {
        type            zeroGradient;
    }
}`;
  }

  private static getKFile(U: number): string {
    // Turbulence intensity I = 0.5% (wind tunnel condition)
    const I = 0.005;
    const k = 1.5 * Math.pow(U * I, 2);

    return `${this.getHeader('k', 'volScalarField')}

dimensions      [0 2 -2 0 0 0 0];
internalField   uniform ${k.toExponential(4)};

boundaryField
{
    inlet
    {
        type            fixedValue;
        value           uniform ${k.toExponential(4)};
    }
    outlet
    {
        type            zeroGradient;
    }
    ground
    {
        type            kqRWallFunction;
        value           uniform ${k.toExponential(4)};
    }
    topAndSides
    {
        type            slip;
    }
    ahmed_body
    {
        type            kqRWallFunction;
        value           uniform ${k.toExponential(4)};
    }
}`;
  }

  private static getOmegaFile(U: number): string {
    const I = 0.005;
    const k = 1.5 * Math.pow(U * I, 2);
    const L = 1.044;
    const l = 0.07 * L; // Turbulent length scale
    const omega = Math.sqrt(k) / (Math.pow(0.09, 0.25) * l);

    return `${this.getHeader('omega', 'volScalarField')}

dimensions      [0 0 -1 0 0 0 0];
internalField   uniform ${omega.toFixed(2)};

boundaryField
{
    inlet
    {
        type            fixedValue;
        value           uniform ${omega.toFixed(2)};
    }
    outlet
    {
        type            zeroGradient;
    }
    ground
    {
        type            omegaWallFunction;
        value           uniform ${omega.toFixed(2)};
    }
    topAndSides
    {
        type            slip;
    }
    ahmed_body
    {
        type            omegaWallFunction;
        value           uniform ${omega.toFixed(2)};
    }
}`;
  }

  private static getNutFile(): string {
    return `${this.getHeader('nut', 'volScalarField')}

dimensions      [0 2 -1 0 0 0 0];
internalField   uniform 0;

boundaryField
{
    inlet
    {
        type            calculated;
        value           uniform 0;
    }
    outlet
    {
        type            calculated;
        value           uniform 0;
    }
    ground
    {
        type            nutkWallFunction;
        value           uniform 0;
    }
    topAndSides
    {
        type            calculated;
        value           uniform 0;
    }
    ahmed_body
    {
        type            nutkWallFunction;
        value           uniform 0;
    }
}`;
  }

  private static getTransportProperties(nu: number): string {
    return `${this.getHeader('transportProperties')}

transportModel  Newtonian;
nu              [0 2 -1 0 0 0 0] ${nu.toExponential(4)};`;
  }

  private static getTurbulenceProperties(): string {
    return `${this.getHeader('turbulenceProperties')}

simulationType  RAS;

RAS
{
    RASModel        kOmegaSST;
    turbulence      on;
    printCoeffs     on;
}`;
  }

  private static getControlDict(config: OpenFoamCaseConfig, Aref: number): string {
    return `${this.getHeader('controlDict')}

application     simpleFoam;
startFrom       startTime;
startTime       0;
stopAt          endTime;
endTime         ${config.maxIterations};
deltaT          1;
writeControl    timeStep;
writeInterval   100;
purgeWrite      3;
writeFormat     ascii;
writePrecision  7;
writeCompression off;
timeFormat      general;
timePrecision   6;
runTimeModifiable true;

functions
{
    forces
    {
        type            forces;
        libs            ("libforces.so");
        writeControl    timeStep;
        writeInterval   1;
        patches         (ahmed_body);
        pName           p;
        UName           U;
        log             true;
        rho             rhoInf;
        rhoInf          ${config.airDensity};
        CofG            (0.522 0.05 0); // Center of gravity / reference moment center
    }

    forceCoeffs
    {
        type            forceCoeffs;
        libs            ("libforces.so");
        writeControl    timeStep;
        writeInterval   1;
        patches         (ahmed_body);
        pName           p;
        UName           U;
        log             true;
        rho             rhoInf;
        rhoInf          ${config.airDensity};
        CofG            (0.522 0.05 0);
        liftDir         (0 1 0);       // Y is vertical up
        dragDir         (1 0 0);       // X is longitudinal freestream
        pitchAxis       (0 0 1);       // Z is lateral
        magUInf         ${config.freestreamVelocity};
        lRef            1.044;         // Body length
        Aref            ${Aref.toFixed(6)}; // Projected frontal area
    }
}`;
  }

  private static getBlockMeshDict(p: AhmedBodyDimensions): string {
    // Sizing conforming to §9.1:
    // Inlet: 3L upstream (-3.132m)
    // Outlet: 6L downstream (+6.264m)
    // Lateral width: W_domain = 3.0m (Blockage ratio < 2.5%)
    // Height: H_domain = 1.8m
    const xMin = -3.2;
    const xMax = 6.5;
    const yMin = 0.0;
    const yMax = 1.8;
    const zMin = -1.5;
    const zMax = 1.5;

    return `${this.getHeader('blockMeshDict')}

scale   1.0;

vertices
(
    (${xMin} ${yMin} ${zMin}) // 0
    (${xMax} ${yMin} ${zMin}) // 1
    (${xMax} ${yMax} ${zMin}) // 2
    (${xMin} ${yMax} ${zMin}) // 3
    (${xMin} ${yMin} ${zMax}) // 4
    (${xMax} ${yMin} ${zMax}) // 5
    (${xMax} ${yMax} ${zMax}) // 6
    (${xMin} ${yMax} ${zMax}) // 7
);

blocks
(
    hex (0 1 2 3 4 5 6 7) (80 20 30) simpleGrading (1 1 1)
);

edges
(
);

boundary
(
    inlet
    {
        type patch;
        faces
        (
            (0 4 7 3)
        );
    }
    outlet
    {
        type patch;
        faces
        (
            (1 2 6 5)
        );
    }
    ground
    {
        type wall;
        faces
        (
            (0 1 5 4)
        );
    }
    topAndSides
    {
        type patch;
        faces
        (
            (3 2 6 7)
            (0 3 2 1)
            (4 5 6 7)
        );
    }
);`;
  }

  private static getSnappyHexMeshDict(): string {
    return `${this.getHeader('snappyHexMeshDict')}

castellatedMesh true;
snap            true;
addLayers       true;

geometry
{
    ahmed_body.stl
    {
        type triSurfaceMesh;
        name ahmed_body;
    }
    refinementBox
    {
        type searchableBox;
        min (-0.2 0.0 -0.4);
        max ( 2.2 0.6  0.4);
    }
};

castellatedMeshControls
{
    maxLocalCells 2000000;
    maxGlobalCells 5000000;
    minRefinementCells 10;
    nCellsBetweenLevels 3;

    features
    (
        {
            file "ahmed_body.eMesh";
            level 2;
        }
    );

    refinementSurfaces
    {
        ahmed_body
        {
            level (2 3);
            patchInfo
            {
                type wall;
            }
        }
    }

    resolveFeatureAngle 30;

    refinementRegions
    {
        refinementBox
        {
            mode inside;
            levels ((1E15 1));
        }
    }

    locationInMesh (0.0 1.0 0.0);
    allowFreeStandingZoneFaces true;
}

snapControls
{
    nSmoothPatch 3;
    tolerance 2.0;
    nSolveIter 30;
    nRelaxIter 5;
}

addLayersControls
{
    relativeSizes true;
    layers
    {
        "ahmed_body.*"
        {
            nSurfaceLayers 3;
        }
    }
    expansionRatio 1.2;
    finalLayerThickness 0.5;
    minThickness 0.1;
    nGrow 0;
}

meshQualityControls
{
    maxNonOrtho 65;
    maxBoundarySkewness 20;
    maxInternalSkewness 4;
    maxConcave 80;
    minVol 1e-13;
    minTetQuality 1e-15;
    minArea -1;
    minTwist 0.02;
    minDeterminant 0.001;
    minFaceWeight 0.02;
}

writeFlags
(
    collocatedPoints
);

mergeTolerance 1e-6;`;
  }

  private static getFvSchemes(): string {
    return `${this.getHeader('fvSchemes')}

ddtSchemes
{
    default         steadyState;
}

gradSchemes
{
    default         Gauss linear;
    grad(p)         Gauss linear;
    grad(U)         cellLimited Gauss linear 1;
}

divSchemes
{
    default         none;
    div(phi,U)      bounded Gauss linearUpwind grad(U);
    div(phi,k)      bounded Gauss upwind;
    div(phi,omega)  bounded Gauss upwind;
    div((nuEff*dev2(T(grad(U))))) Gauss linear;
}

laplacianSchemes
{
    default         Gauss linear corrected;
}

interpolationSchemes
{
    default         linear;
}

snGradSchemes
{
    default         corrected;
}`;
  }

  private static getFvSolution(): string {
    return `${this.getHeader('fvSolution')}

solvers
{
    p
    {
        solver          GAMG;
        tolerance       1e-6;
        relTol          0.05;
        smoother        GaussSeidel;
    }

    "(U|k|omega)"
    {
        solver          smoothSolver;
        smoother        symGaussSeidel;
        tolerance       1e-6;
        relTol          0.1;
    }
}

SIMPLE
{
    nNonOrthogonalCorrectors 2;
    consistent      yes;

    residualControl
    {
        p               1e-4;
        U               1e-4;
        k               1e-4;
        omega           1e-4;
    }
}

relaxationFactors
{
    equations
    {
        U               0.7;
        k               0.7;
        omega           0.7;
    }
    fields
    {
        p               0.3;
    }
}`;
  }

  private static getDecomposeParDict(cores: number): string {
    return `${this.getHeader('decomposeParDict')}

numberOfSubdomains ${cores};
method          scotch;`;
  }

  private static getAllrunScript(cores: number): string {
    return `#!/bin/bash
# AutoVerse 3D OpenFOAM Verification Allrun Script
set -e

echo "=== AutoVerse 3D OpenFOAM Pipeline Execution ==="
echo "Running blockMesh..."
blockMesh > log.blockMesh 2>&1

echo "Extracting surface features..."
surfaceFeatureExtract > log.surfaceFeatureExtract 2>&1 || true

echo "Running snappyHexMesh..."
snappyHexMesh -overwrite > log.snappyHexMesh 2>&1

echo "Checking mesh quality..."
checkMesh > log.checkMesh 2>&1

echo "Initializing flow field..."
# Overwrite 0/ from initial setup if needed

echo "Solving steady-state RANS with simpleFoam..."
if [ "${cores}" -gt 1 ]; then
    decomposePar > log.decomposePar 2>&1
    mpirun -np ${cores} simpleFoam -parallel > log.simpleFoam 2>&1
    reconstructPar -latestTime > log.reconstructPar 2>&1
else
    simpleFoam > log.simpleFoam 2>&1
fi

echo "Extracting aerodynamic force coefficients..."
# Forces are logged in postProcessing/forceCoeffs/0/coefficient.dat
echo "=== Case Execution Complete ==="
`;
  }

  private static getAllcleanScript(): string {
    return `#!/bin/bash
rm -rf [1-9]* processor* postProcessing log.* constant/polyMesh
echo "Case cleaned."
`;
  }
}
