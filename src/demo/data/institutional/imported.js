/* ============================================================
   GENERADO POR scripts/import-dashboard-sync.mjs — NO EDITAR A MANO
   ============================================================
   Proyección de campos permitidos de los dashboard_sync.json de la entrega
   05_INSTITUTIONS (28 sep 2026). El JSON fuente vive en drive-files/ y no se
   publica: acá sólo llega lo que el manual de Sustain autoriza a mostrar,
   más los identificadores criptográficos necesarios para la auditoría.

   Indexado por action_id: reimportar es un UPSERT, no puede duplicar.
   Para regenerar: node scripts/import-dashboard-sync.mjs
   Para verificar: npm run verify:institutional
   ============================================================ */

export const IMPORTED_INSTITUTIONS = {
  "spn_394da9811c6ea308b5841147": {
    "nodeId": "spn_394da9811c6ea308b5841147",
    "folder": "spn_394da9811c6ea308b5841147_Posicionarte",
    "actionIds": [
      "spa_1d5ab097e8ef11a8c1f5a0b1"
    ]
  },
  "spn_776c056a5d48505e28e48471": {
    "nodeId": "spn_776c056a5d48505e28e48471",
    "folder": "spn_776c056a5d48505e28e48471_Montessori",
    "actionIds": [
      "spa_28e2ea29d11c7e8200af48f2",
      "spa_245c52c46011db10e4e0fe5c",
      "spa_e3f59a696ba3e4158a70eeef"
    ]
  }
};

export const IMPORTED_ACTIONS = {
  "spa_1d5ab097e8ef11a8c1f5a0b1": {
    "actionId": "spa_1d5ab097e8ef11a8c1f5a0b1",
    "nodeId": "spn_394da9811c6ea308b5841147",
    "schemaVersion": "2.2",
    "sourceCapVersion": "1.2",
    "module": "cleanup",
    "actionType": "community_cleanup",
    "title": "Public-space cleanup — Mar del Plata",
    "description": "Collective public-space cleanup documented by original photo/video evidence.",
    "section": "Limpiezas",
    "dates": {
      "occurredOn": "2026-05-30",
      "evidenceReceivedOn": null,
      "anchoredAt": "2026-09-21T09:49:24Z",
      "finalizedAt": "2026-09-21T09:49:24Z"
    },
    "location": {
      "city": "Mar del Plata",
      "province": "Buenos Aires",
      "country": "Argentina",
      "privacyMode": "LIMITED"
    },
    "validation": {
      "status": "valid_with_limitations",
      "depth": "MEDIUM",
      "evidenceQuality": "multi_file_before_during_after_sequence",
      "duplicateRisk": "LOW_WITHIN_SUBMISSION",
      "ambiguities": [
        "Waste mass was not measured.",
        "Bag/container count cannot be reliably enumerated.",
        "Final disposal destination was not documented."
      ],
      "auditNotes": [
        "No numeric waste or emissions claim is authorized."
      ],
      "checks": {
        "before_during_after_consistency": "pass_operator_review",
        "container_count_reliable": false,
        "cross_action_duplicate_check": "requires_registry",
        "evidence_hashes": "pass",
        "mass_measurement_available": false,
        "original_bytes_preserved": true,
        "required_fields": "pass",
        "social_api_verified": false
      }
    },
    "mrv": {
      "category": "public_space_cleanup",
      "measurement": {
        "container_count": null,
        "container_count_status": "not_reliably_countable",
        "destination_status": "unknown",
        "disposal_destination": null,
        "qualitative_quantity": "visible litter removed",
        "quantification_confidence": "qualitative_only",
        "waste_mass_kg": null,
        "waste_mass_status": "not_measured"
      },
      "result": {
        "cleanup_activity_verified": true,
        "waste_mass_kg": null,
        "waste_removed": "observed"
      },
      "limitations": [
        "Waste mass was not measured.",
        "Bag/container count cannot be reliably enumerated.",
        "Final disposal destination was not documented."
      ],
      "methodology": {
        "id": "SUSTAIN-CLEANUP-EVIDENCE-001",
        "version": "1.0",
        "status": "pilot",
        "calculationType": "qualitative_evidence_validation"
      },
      "reporting": {
        "participantCount": 2
      }
    },
    "baseline": {
      "applicability": "not_applicable",
      "status": "not_provided"
    },
    "score": {
      "policyApplied": "Cleanup_SES_v1.0",
      "policyId": "Cleanup_SES_v1.0",
      "policyVersion": "1.0.0",
      "policyStatus": "active_pilot_governance",
      "scientificStatus": "provisional_not_externally_endorsed",
      "grossSesDelta": 8,
      "attributedSesDelta": 8,
      "reason": null,
      "rewardEnabled": null,
      "components": {
        "destination_traceability": 0,
        "evidence_assurance": 2,
        "measured_magnitude": 0,
        "social_layer": 0,
        "verified_action": 6
      },
      "organizationProjection": {
        "method": "full_action_score_reference_non_additive",
        "nodeId": "spn_394da9811c6ea308b5841147",
        "sesDelta": 8
      },
      "collectiveAllocations": [
        {
          "nodeId": "spn_73dc30a5c6ceb119a2fa8eed",
          "share": 0.5,
          "attributedSesDelta": 4,
          "grossSesDelta": 8,
          "scoreStatus": "scored"
        },
        {
          "nodeId": "spn_54a721d09e4e61bc0787ab01",
          "share": 0.5,
          "attributedSesDelta": 4,
          "grossSesDelta": 8,
          "scoreStatus": "scored"
        }
      ]
    },
    "attribution": {
      "method": "shared_non_additive",
      "organizationSes": "full_action_score_reference_non_additive",
      "personalSes": "allocated_by_recognition_share",
      "physicalImpactAccounting": "count_once",
      "beneficiaryNodes": [],
      "collaboratorNodes": [],
      "globalActionCount": 1
    },
    "hierarchy": {
      "id": "posicionarte_pilot_hierarchy",
      "version": "1.0",
      "nodes": [
        {
          "nodeId": "spn_73dc30a5c6ceb119a2fa8eed",
          "displayName": "Posicionarte Volunteer 01",
          "nodeType": "individual",
          "publicIdentity": false
        },
        {
          "nodeId": "spn_54a721d09e4e61bc0787ab01",
          "displayName": "Posicionarte Volunteer 02",
          "nodeType": "individual",
          "publicIdentity": false
        },
        {
          "nodeId": "spn_394da9811c6ea308b5841147",
          "displayName": "Posicionarte",
          "nodeType": "institution",
          "publicIdentity": null
        }
      ],
      "edges": [
        {
          "child": "spn_73dc30a5c6ceb119a2fa8eed",
          "parent": "spn_394da9811c6ea308b5841147",
          "relationship": "member_of"
        },
        {
          "child": "spn_54a721d09e4e61bc0787ab01",
          "parent": "spn_394da9811c6ea308b5841147",
          "relationship": "member_of"
        }
      ],
      "externalCollaborators": [],
      "rollup": {
        "action_count_rule": "distinct_action_id_once_per_ancestor",
        "deduplication_key": "action_id",
        "institutional_score_policy": "full_action_score_reference_non_additive",
        "personal_ses_rollup": false,
        "physical_metric_rule": "distinct_action_metric_once_per_ancestor"
      }
    },
    "registryProof": {
      "state": "READY_FOR_AGENCY",
      "storageType": "hash_only",
      "anchorRef": "sha256:9641084c2fcf25fc8fa361861f333f9e40950a0327bbe05f5de637e273447376",
      "onchain": {
        "chainId": 56,
        "networkName": "BNB Smart Chain",
        "contractAddress": "0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B",
        "transactionHash": "0x3081a64d8d52cf9e356c0ec3d2297e0bfa6ee5fe44f8f002f57a1f7db6d52d36",
        "blockNumber": 123160023,
        "blockHash": "0x5d40ca5f95b93c2fb232e2430c6d4fd5252006ff9fd092725f8eba85bd7c79f3",
        "blockTimestamp": "2026-09-21T09:49:24Z",
        "eventName": "ActionAnchored",
        "anchorMethod": "anchorAction(string,string)",
        "logIndex": 112,
        "from": "0xb4e8004e4047838c9fd8d4e2a0ba12791935b758",
        "receiptStatus": "success"
      }
    },
    "integrity": {
      "canonicalRoot": "sha256:9641084c2fcf25fc8fa361861f333f9e40950a0327bbe05f5de637e273447376",
      "canonicalActionSha256": "22c7037eca266d6414b74bf278be898fca514cbf4e432e17e0894462d4f2f144",
      "canonicalCoreImmutable": true
    },
    "privacy": {
      "classification": "limited",
      "publicFields": [
        "action_id",
        "occurred_on",
        "city",
        "province",
        "organization",
        "pseudonyms",
        "qualitative_cleanup_status",
        "social_permalink"
      ],
      "restrictedFields": [
        "coordenadas exactas",
        "identidad real de los participantes",
        "fotos y videos originales"
      ],
      "retentionPolicy": "Sustain pilot policy"
    },
    "synchronization": {
      "operation": "UPSERT",
      "idempotencyKey": "spa_1d5ab097e8ef11a8c1f5a0b1:sha256:9641084c2fcf25fc8fa361861f333f9e40950a0327bbe05f5de637e273447376:0x3081a64d8d52cf9e356c0ec3d2297e0bfa6ee5fe44f8f002f57a1f7db6d52d36",
      "syncStatus": "READY_FOR_AGENCY"
    },
    "computeFootprint": {
      "accountingStatus": "unquantified",
      "aiUsage": true
    },
    "media": {
      "candidates": [],
      "candidateCount": 0,
      "publicationAuthorized": false,
      "approvalScope": null,
      "schoolOnlyStatus": null,
      "technicalZipContainsOriginalMedia": true
    },
    "source": {
      "dashboardSyncSha256": "71adc045e8eeb0de9e41a615089c1cd4e3d07fd14969ca43a74efbe20f19d54b",
      "technicalZipSha256": "169a992930004f00a0d6df3fef44126a8803b481f55331039a67c08aaa097d40",
      "relativePath": "02_INSTITUTIONS/spn_394da9811c6ea308b5841147_Posicionarte/01_ACTIONS/spa_1d5ab097e8ef11a8c1f5a0b1_limpieza_comunitaria_2026-05-30"
    }
  },
  "spa_28e2ea29d11c7e8200af48f2": {
    "actionId": "spa_28e2ea29d11c7e8200af48f2",
    "nodeId": "spn_776c056a5d48505e28e48471",
    "schemaVersion": "2.2",
    "sourceCapVersion": "1.2",
    "module": "environmental_education",
    "actionType": "collective_awareness_campaign",
    "title": "Mensajes de sexto grado para cuidar el agua y la energía",
    "description": "Según la presentación del operador, alumnos de sexto grado diseñaron mensajes de concientización que se imprimieron y colocaron en la escuela. Ocho diseños y cuatro fotografías de instalación fueron aportados; cobertura total no inventariada.",
    "section": "Educación Ambiental",
    "dates": {
      "occurredOn": null,
      "evidenceReceivedOn": "2026-08-14",
      "anchoredAt": "2026-09-28T03:06:00Z",
      "finalizedAt": "2026-09-28T03:06:00Z"
    },
    "location": {
      "city": null,
      "province": null,
      "country": "AR",
      "privacyMode": "LIMITED"
    },
    "validation": {
      "status": "valid_with_limitations",
      "depth": "MEDIUM",
      "evidenceQuality": "design_and_photographed_installation",
      "duplicateRisk": "LOW_WITHIN_SUBMISSION",
      "ambiguities": [
        "Exact activity date unknown; 14 August is the operator-reported evidence receipt date.",
        "Schoolwide placement is operator attested, not established by an inventory.",
        "No water, electricity or carbon saving was measured.",
        "Student image bytes are not supplied or represented as verified hashes."
      ],
      "auditNotes": [
        "No schoolwide coverage or saving quantity claim."
      ],
      "checks": {
        "cross_action_duplicate_check": "requires_registry",
        "evidence_hashes": "pass",
        "original_bytes_preserved": true,
        "privacy_check": "pass",
        "required_fields": "pass"
      }
    },
    "mrv": {
      "category": "environmental_education",
      "measurement": {
        "co2_avoided_kg": null,
        "design_files_supplied": 8,
        "electricity_saved_kwh": null,
        "faucets_covered": null,
        "installation_photos_supplied": 4,
        "stickers_installed": null,
        "stickers_produced": null,
        "student_count": null,
        "water_saved_liters": null
      },
      "result": {
        "educational_campaign_documented": true,
        "savings_measured": false,
        "schoolwide_coverage_verified": false
      },
      "limitations": [
        "Exact activity date unknown; 14 August is the operator-reported evidence receipt date.",
        "Schoolwide placement is operator attested, not established by an inventory.",
        "No water, electricity or carbon saving was measured.",
        "Student image bytes are not supplied or represented as verified hashes."
      ],
      "methodology": {
        "id": "SUSTAIN-EDUCATION-EVIDENCE-PILOT",
        "version": "0.1",
        "status": "pilot",
        "calculationType": "qualitative_evidence_validation"
      },
      "reporting": {
        "participantCount": null
      }
    },
    "baseline": {
      "applicability": "not_applicable",
      "status": "not_provided"
    },
    "score": {
      "policyApplied": "RECORD_ONLY",
      "policyId": "Genesis_SES_v1.0",
      "policyVersion": "1.0",
      "policyStatus": null,
      "scientificStatus": null,
      "grossSesDelta": 0,
      "attributedSesDelta": 0,
      "reason": "No numeric environmental education score in current SES specification and no measured savings.",
      "rewardEnabled": false,
      "components": null,
      "organizationProjection": null,
      "collectiveAllocations": []
    },
    "attribution": {
      "method": "cohort_non_additive",
      "organizationSes": "no_award",
      "personalSes": "no_award",
      "physicalImpactAccounting": "count_once",
      "beneficiaryNodes": [
        "spn_776c056a5d48505e28e48471"
      ],
      "collaboratorNodes": [],
      "globalActionCount": 1
    },
    "hierarchy": {
      "id": "montessori-2026-pilot",
      "version": "1.0",
      "nodes": [
        {
          "nodeId": "spn_4e42abca7b6c2d7644a70d2d",
          "displayName": "Sexto grado · ciclo lectivo 2026",
          "nodeType": "cohort",
          "publicIdentity": false
        },
        {
          "nodeId": "spn_776c056a5d48505e28e48471",
          "displayName": "Colegio Ana María Montessori",
          "nodeType": "institution",
          "publicIdentity": null
        }
      ],
      "edges": [
        {
          "child": "spn_4e42abca7b6c2d7644a70d2d",
          "parent": "spn_776c056a5d48505e28e48471",
          "relationship": "member_of"
        }
      ],
      "externalCollaborators": [],
      "rollup": {
        "action_count_rule": "distinct_action_id_once_per_ancestor",
        "deduplication_key": "action_id",
        "institutional_score_policy": "non_additive_reference",
        "personal_ses_rollup": false,
        "physical_metric_rule": "distinct_action_metric_once_per_ancestor"
      }
    },
    "registryProof": {
      "state": "READY_FOR_AGENCY",
      "storageType": "hash_only",
      "anchorRef": "sha256:5109eeb28989fc0cb15cf165f05fc328020faa8494e2f34ff8f07b0538c16a7e",
      "onchain": {
        "chainId": 56,
        "networkName": "BNB Smart Chain",
        "contractAddress": "0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B",
        "transactionHash": "0xff0080fe8b22059dc93e2b4668adbaa21cc61037df41971c8360fcca4b5b1a1e",
        "blockNumber": 124449807,
        "blockHash": "0x385ae290d83ee20c707f40c31b0b63204ab3b0c6ce7005142a0be663f80b02de",
        "blockTimestamp": "2026-09-28T03:06:00Z",
        "eventName": "ActionAnchored",
        "anchorMethod": "anchorAction(string,string)",
        "logIndex": 205,
        "from": "0xb4e8004e4047838c9fd8d4e2a0ba12791935b758",
        "receiptStatus": "success"
      }
    },
    "integrity": {
      "canonicalRoot": "sha256:5109eeb28989fc0cb15cf165f05fc328020faa8494e2f34ff8f07b0538c16a7e",
      "canonicalActionSha256": "d66d17fcdc036ce111452d86312ccbfaed062e43abff1f86ece1318b88b84255",
      "canonicalCoreImmutable": true
    },
    "privacy": {
      "classification": "limited",
      "publicFields": [
        "action_id",
        "cohort_label",
        "category",
        "public_designs"
      ],
      "restrictedFields": [
        "imágenes de alumnos",
        "nombres de alumnos",
        "ubicación exacta"
      ],
      "retentionPolicy": "school_controlled_for_minor_media"
    },
    "synchronization": {
      "operation": "UPSERT",
      "idempotencyKey": "spa_28e2ea29d11c7e8200af48f2:sha256:5109eeb28989fc0cb15cf165f05fc328020faa8494e2f34ff8f07b0538c16a7e:0xff0080fe8b22059dc93e2b4668adbaa21cc61037df41971c8360fcca4b5b1a1e",
      "syncStatus": "READY_FOR_AGENCY"
    },
    "computeFootprint": {
      "accountingStatus": "unquantified",
      "aiUsage": true
    },
    "media": {
      "candidates": [
        "01_mensajes_disenos_01.jpeg",
        "01_mensajes_disenos_02.jpeg",
        "01_mensajes_disenos_03.jpeg",
        "01_mensajes_disenos_04.jpeg",
        "01_mensajes_disenos_05.jpeg",
        "01_mensajes_disenos_06.jpeg",
        "01_mensajes_disenos_07.jpeg",
        "01_mensajes_disenos_08.jpeg"
      ],
      "candidateCount": 8,
      "publicationAuthorized": false,
      "approvalScope": "school_editorial_clearance_before_web_publication",
      "schoolOnlyStatus": "designs_candidate; installation photos omitted; child media school_only",
      "technicalZipContainsOriginalMedia": false
    },
    "source": {
      "dashboardSyncSha256": "c18be2dac0d51d07ff4ca81a615cd07dc18ed96a52e0465531b7c7ebc9f0b3e6",
      "technicalZipSha256": "61a7364df49a6f037497b9a09f72e0943b7a04184ceb985d2e39862232b53148",
      "relativePath": "02_INSTITUTIONS/spn_776c056a5d48505e28e48471_Montessori/01_ACTIONS/spa_28e2ea29d11c7e8200af48f2_01_mensajes_agua_energia"
    }
  },
  "spa_245c52c46011db10e4e0fe5c": {
    "actionId": "spa_245c52c46011db10e4e0fe5c",
    "nodeId": "spn_776c056a5d48505e28e48471",
    "schemaVersion": "2.2",
    "sourceCapVersion": "1.2",
    "module": "environmental_education",
    "actionType": "school_garden_project_initiation",
    "title": "Huerta escolar con salas de 5 años y apoyo municipal",
    "description": "Según el mensaje remitido por el referente de la escuela, se inició un nuevo proyecto de huerta con las salas de 5 años. La Dirección de Ambiente de la Municipalidad de Lomas de Zamora aportó un taller, huerteros y plantines. Dos fotografías muestran canteros con plantas y materiales con identificación municipal; la realización del taller, la entrega y la participación de niños constan por declaración de la escuela y no se muestran en las fotos aportadas.",
    "section": "Educación Ambiental",
    "dates": {
      "occurredOn": null,
      "evidenceReceivedOn": "2026-09-16",
      "anchoredAt": "2026-09-28T05:07:10Z",
      "finalizedAt": "2026-09-28T05:07:10Z"
    },
    "location": {
      "city": null,
      "province": null,
      "country": "AR",
      "privacyMode": "LIMITED"
    },
    "validation": {
      "status": "valid_with_limitations",
      "depth": "LIMITED",
      "evidenceQuality": "two_garden_photos_and_operator_statement",
      "duplicateRisk": "LOW_WITHIN_SUBMISSION",
      "ambiguities": [
        "Exact activity date unknown; 16 September 2026 is the operator-reported evidence receipt date.",
        "Two photos show plants, garden beds and municipal-branded materials; they do not show the workshop, the gardeners, the handover or the children.",
        "Workshop, gardeners and seedlings supplied by the municipal environmental office are school-reported; municipal participation is not independently confirmed.",
        "Two garden beds are visible in one photo, but the total number of beds and plants is not established.",
        "No roster, participant count, harvest, water use, carbon outcome or other measured impact was supplied.",
        "Additional images and videos of minors remain with the school; no bytes or hashes for those files were provided."
      ],
      "auditNotes": [
        "Municipal node is an unclaimed pilot reference; no official municipal endorsement, score or action count."
      ],
      "checks": {
        "cross_action_duplicate_check": "requires_registry",
        "evidence_hashes": "pass",
        "original_bytes_preserved": true,
        "privacy_check": "pass",
        "required_fields": "pass"
      }
    },
    "mrv": {
      "category": "environmental_education",
      "measurement": {
        "beds_observed_in_photos": 2,
        "beds_total": null,
        "co2_avoided_kg": null,
        "garden_area_m2": null,
        "garden_photos_supplied": 2,
        "harvest_kg": null,
        "seedlings_donated": null,
        "seedlings_planted": null,
        "student_count": null,
        "water_saved_liters": null,
        "water_used_liters": null,
        "workshops_reported": null
      },
      "result": {
        "environmental_outcomes_measured": false,
        "municipal_support_independently_verified": false,
        "municipal_support_school_reported": true,
        "school_garden_photographed": true
      },
      "limitations": [
        "Exact activity date unknown; 16 September 2026 is the operator-reported evidence receipt date.",
        "Two photos show plants, garden beds and municipal-branded materials; they do not show the workshop, the gardeners, the handover or the children.",
        "Workshop, gardeners and seedlings supplied by the municipal environmental office are school-reported; municipal participation is not independently confirmed.",
        "Two garden beds are visible in one photo, but the total number of beds and plants is not established.",
        "No roster, participant count, harvest, water use, carbon outcome or other measured impact was supplied.",
        "Additional images and videos of minors remain with the school; no bytes or hashes for those files were provided."
      ],
      "methodology": {
        "id": "SUSTAIN-EDUCATION-EVIDENCE-PILOT",
        "version": "0.1",
        "status": "pilot",
        "calculationType": "qualitative_evidence_validation"
      },
      "reporting": {
        "participantCount": null
      }
    },
    "baseline": {
      "applicability": "not_applicable",
      "status": "not_provided"
    },
    "score": {
      "policyApplied": "RECORD_ONLY",
      "policyId": "Genesis_SES_v1.0",
      "policyVersion": "1.0",
      "policyStatus": null,
      "scientificStatus": null,
      "grossSesDelta": 0,
      "attributedSesDelta": 0,
      "reason": "No adopted numeric SES policy for this educational garden activity; no quantified outcomes.",
      "rewardEnabled": false,
      "components": null,
      "organizationProjection": null,
      "collectiveAllocations": []
    },
    "attribution": {
      "method": "cohort_non_additive",
      "organizationSes": "no_award",
      "personalSes": "no_award",
      "physicalImpactAccounting": "count_once",
      "beneficiaryNodes": [
        "spn_776c056a5d48505e28e48471"
      ],
      "collaboratorNodes": [
        "spn_90c9f76529f0dd8c9512bcb5"
      ],
      "globalActionCount": 1
    },
    "hierarchy": {
      "id": "montessori-2026-pilot",
      "version": "1.1",
      "nodes": [
        {
          "nodeId": "spn_08b111bd05e294da507c274f",
          "displayName": "Salas de 5 años · ciclo lectivo 2026",
          "nodeType": "cohort",
          "publicIdentity": false
        },
        {
          "nodeId": "spn_6c33e5a8e47882f5c096900b",
          "displayName": "Jardín / Nivel Inicial · Colegio Ana María Montessori",
          "nodeType": "organizational_unit",
          "publicIdentity": null
        },
        {
          "nodeId": "spn_776c056a5d48505e28e48471",
          "displayName": "Colegio Ana María Montessori",
          "nodeType": "institution",
          "publicIdentity": null
        }
      ],
      "edges": [
        {
          "child": "spn_08b111bd05e294da507c274f",
          "parent": "spn_6c33e5a8e47882f5c096900b",
          "relationship": "member_of"
        },
        {
          "child": "spn_6c33e5a8e47882f5c096900b",
          "parent": "spn_776c056a5d48505e28e48471",
          "relationship": "belongs_to"
        }
      ],
      "externalCollaborators": [
        {
          "nodeId": "spn_90c9f76529f0dd8c9512bcb5",
          "relationship": "reported_support",
          "rollupEnabled": false
        }
      ],
      "rollup": {
        "action_count_rule": "distinct_action_id_once_per_ancestor",
        "deduplication_key": "action_id",
        "institutional_score_policy": "non_additive_reference",
        "personal_ses_rollup": false,
        "physical_metric_rule": "distinct_action_metric_once_per_ancestor"
      }
    },
    "registryProof": {
      "state": "READY_FOR_AGENCY",
      "storageType": "hash_only",
      "anchorRef": "sha256:1e5efdd58aa2b0b3b5a4fa676e223a2e34ea348015584623b6d2912ee0b0acf5",
      "onchain": {
        "chainId": 56,
        "networkName": "BNB Smart Chain",
        "contractAddress": "0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B",
        "transactionHash": "0xdfe3b093888b7aa41fb7b0f156ab5d619057452d48cb549f6a0d95e317275f58",
        "blockNumber": 124465960,
        "blockHash": "0x1757869533753befebc0fcbcb34e05ec6cddc7860e6879a3bc6ecc2d76313d3f",
        "blockTimestamp": "2026-09-28T05:07:10Z",
        "eventName": "ActionAnchored",
        "anchorMethod": "anchorAction(string,string)",
        "logIndex": 0,
        "from": "0xb4e8004e4047838c9fd8d4e2a0ba12791935b758",
        "receiptStatus": "success"
      }
    },
    "integrity": {
      "canonicalRoot": "sha256:1e5efdd58aa2b0b3b5a4fa676e223a2e34ea348015584623b6d2912ee0b0acf5",
      "canonicalActionSha256": "4b24965d607ada1d9b175667ca1a2f5ebc786fc1a1c8bc7fb669c0a5a44c58bc",
      "canonicalCoreImmutable": true
    },
    "privacy": {
      "classification": "limited",
      "publicFields": [
        "action_id",
        "cohort_label",
        "category",
        "garden_photos_subject_to_school_approval"
      ],
      "restrictedFields": [
        "imágenes de alumnos",
        "nombres de alumnos",
        "ubicación exacta"
      ],
      "retentionPolicy": "school_controlled_for_minor_media"
    },
    "synchronization": {
      "operation": "UPSERT",
      "idempotencyKey": "spa_245c52c46011db10e4e0fe5c:sha256:1e5efdd58aa2b0b3b5a4fa676e223a2e34ea348015584623b6d2912ee0b0acf5:0xdfe3b093888b7aa41fb7b0f156ab5d619057452d48cb549f6a0d95e317275f58",
      "syncStatus": "READY_FOR_AGENCY"
    },
    "computeFootprint": {
      "accountingStatus": "unquantified",
      "aiUsage": true
    },
    "media": {
      "candidates": [
        "02_huerta_01.jpeg",
        "02_huerta_02.jpeg"
      ],
      "candidateCount": 2,
      "publicationAuthorized": false,
      "approvalScope": "school_editorial_clearance_before_web_publication",
      "schoolOnlyStatus": "two garden photos candidate; additional child media school_only",
      "technicalZipContainsOriginalMedia": false
    },
    "source": {
      "dashboardSyncSha256": "30f1f2548714e785bb855ecf49530df97fbe2aae0f33a8e54095b84496da5231",
      "technicalZipSha256": "4afe7d98ffcff7630daaa79383477e408393fc0ae0654d820ca7d81ef9459139",
      "relativePath": "02_INSTITUTIONS/spn_776c056a5d48505e28e48471_Montessori/01_ACTIONS/spa_245c52c46011db10e4e0fe5c_02_huerta_sala5"
    }
  },
  "spa_e3f59a696ba3e4158a70eeef": {
    "actionId": "spa_e3f59a696ba3e4158a70eeef",
    "nodeId": "spn_776c056a5d48505e28e48471",
    "schemaVersion": "2.2",
    "sourceCapVersion": "1.2",
    "module": "reforestation",
    "actionType": "educational_tree_planting",
    "title": "Plantación educativa de sexto grado en Tandil",
    "description": "El colegio informó que alumnos de sexto grado participaron de la plantación de un ejemplar en Tandil, Buenos Aires, el 13 de agosto de 2026. Cinco fotografías muestran la actividad y al menos un plantín. La identificación como aguaribay fue mencionada de forma tentativa y no está confirmada. No se cuenta con nómina de alumnos, cantidad total de ejemplares ni seguimiento de supervivencia.",
    "section": "Reforestación",
    "dates": {
      "occurredOn": "2026-08-13",
      "evidenceReceivedOn": "2026-09-04",
      "anchoredAt": "2026-09-28T12:13:49Z",
      "finalizedAt": "2026-09-28T12:13:49Z"
    },
    "location": {
      "city": "Tandil",
      "province": "Buenos Aires",
      "country": "AR",
      "privacyMode": "LIMITED"
    },
    "validation": {
      "status": "valid_with_limitations",
      "depth": "LIMITED",
      "evidenceQuality": "five_restricted_photos_reviewed_hashes_only",
      "duplicateRisk": "LOW_WITHIN_SUBMISSION",
      "ambiguities": [
        "The school/operator reports the planting on 2026-08-13; photographs were forwarded to the operator on 2026-09-04.",
        "Five photographs depict a planting event and at least one sapling, not a verified count of trees planted or surviving.",
        "Aguaribay is an unconfirmed reported species; botanical identification and later survival require separate evidence.",
        "No participant roster, planting permission, exact coordinates or measured carbon outcome was supplied.",
        "Original images of minors are excluded from this package; school retention of matching bytes has not been confirmed."
      ],
      "auditNotes": [
        "Images excluded. No publication consent inferred. Custody confirmation and recoverability pending."
      ],
      "checks": {
        "cross_action_duplicate_check": "requires_registry",
        "evidence_hashes": "calculated_from_supplied_bytes",
        "original_bytes_preserved": false,
        "privacy_check": "pass_media_excluded",
        "required_fields": "pass"
      }
    },
    "mrv": {
      "category": "reforestation",
      "measurement": {
        "co2_removed_kg": null,
        "participant_count": null,
        "planting_events_documented": 1,
        "restricted_photos_hashed": 5,
        "saplings_planted_total": null,
        "saplings_visible_min": 1,
        "species_confirmed": false,
        "species_reported": "aguaribay",
        "trees_surviving": null
      },
      "result": {
        "carbon_measured": false,
        "planting_event_photographed": true,
        "species_confirmed": false,
        "survival_verified": false,
        "tree_count_verified": false
      },
      "limitations": [
        "The school/operator reports the planting on 2026-08-13; photographs were forwarded to the operator on 2026-09-04.",
        "Five photographs depict a planting event and at least one sapling, not a verified count of trees planted or surviving.",
        "Aguaribay is an unconfirmed reported species; botanical identification and later survival require separate evidence.",
        "No participant roster, planting permission, exact coordinates or measured carbon outcome was supplied.",
        "Original images of minors are excluded from this package; school retention of matching bytes has not been confirmed."
      ],
      "methodology": {
        "id": "SUSTAIN-EDUCATION-EVIDENCE-PILOT",
        "version": "0.1",
        "status": "pilot",
        "calculationType": "qualitative_evidence_validation"
      },
      "reporting": {
        "participantCount": null
      }
    },
    "baseline": {
      "applicability": "not_applicable",
      "status": "not_provided"
    },
    "score": {
      "policyApplied": "RECORD_ONLY",
      "policyId": "Genesis_SES_v1.0",
      "policyVersion": "1.0",
      "policyStatus": null,
      "scientificStatus": null,
      "grossSesDelta": 0,
      "attributedSesDelta": 0,
      "reason": "No adopted numeric SES policy for educational tree planting; tree survival and carbon outcomes are not measured.",
      "rewardEnabled": false,
      "components": null,
      "organizationProjection": null,
      "collectiveAllocations": []
    },
    "attribution": {
      "method": "cohort_non_additive",
      "organizationSes": "no_award",
      "personalSes": "no_award",
      "physicalImpactAccounting": "count_once",
      "beneficiaryNodes": [
        "spn_776c056a5d48505e28e48471"
      ],
      "collaboratorNodes": [],
      "globalActionCount": 1
    },
    "hierarchy": {
      "id": "montessori-2026-pilot",
      "version": "1.2",
      "nodes": [
        {
          "nodeId": "spn_4e42abca7b6c2d7644a70d2d",
          "displayName": "Sexto grado · ciclo lectivo 2026",
          "nodeType": "cohort",
          "publicIdentity": false
        },
        {
          "nodeId": "spn_3e3b59c2bb8df74bdcb04142",
          "displayName": "Nivel Primario · Colegio Ana María Montessori",
          "nodeType": "organizational_unit",
          "publicIdentity": null
        },
        {
          "nodeId": "spn_776c056a5d48505e28e48471",
          "displayName": "Colegio Ana María Montessori",
          "nodeType": "institution",
          "publicIdentity": null
        }
      ],
      "edges": [
        {
          "child": "spn_4e42abca7b6c2d7644a70d2d",
          "parent": "spn_3e3b59c2bb8df74bdcb04142",
          "relationship": "member_of"
        },
        {
          "child": "spn_3e3b59c2bb8df74bdcb04142",
          "parent": "spn_776c056a5d48505e28e48471",
          "relationship": "belongs_to"
        }
      ],
      "externalCollaborators": [],
      "rollup": {
        "action_count_rule": "distinct_action_id_once_per_ancestor",
        "deduplication_key": "action_id",
        "institutional_score_policy": "non_additive_reference",
        "personal_ses_rollup": false,
        "physical_metric_rule": "distinct_action_metric_once_per_ancestor"
      }
    },
    "registryProof": {
      "state": "READY_FOR_AGENCY",
      "storageType": "hash_only",
      "anchorRef": "sha256:e23abb2b07eea9eb6b756cc23a8061b58881ab9ab8eff98f45b492a07b3e5d21",
      "onchain": {
        "chainId": 56,
        "networkName": "BNB Smart Chain",
        "contractAddress": "0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B",
        "transactionHash": "0x37158dbcb9a4264baae33190614aa21a9bf52f9ddfa55f86e144fe2647e0ba6a",
        "blockNumber": 124522825,
        "blockHash": "0xc8fc8411a7abeb10b8323484565f6a276b0ba1f62873c18f84e27a6c98df5b21",
        "blockTimestamp": "2026-09-28T12:13:49Z",
        "eventName": "ActionAnchored",
        "anchorMethod": "anchorAction(string,string)",
        "logIndex": 100,
        "from": "0xb4e8004e4047838c9fd8d4e2a0ba12791935b758",
        "receiptStatus": "success"
      }
    },
    "integrity": {
      "canonicalRoot": "sha256:e23abb2b07eea9eb6b756cc23a8061b58881ab9ab8eff98f45b492a07b3e5d21",
      "canonicalActionSha256": "130d005ee2f174e09c59b5868f41b9dd7c514d106ac2881dd962aabf420dda88",
      "canonicalCoreImmutable": true
    },
    "privacy": {
      "classification": "restricted_minor_media",
      "publicFields": [
        "action_id",
        "cohort_label",
        "category",
        "generalized_location",
        "event_date"
      ],
      "restrictedFields": [
        "fotos de menores",
        "hashes de las fotos restringidas",
        "nombres de alumnos",
        "ubicación exacta"
      ],
      "retentionPolicy": "school_controlled; retention and recovery to be confirmed"
    },
    "synchronization": {
      "operation": "UPSERT",
      "idempotencyKey": "spa_e3f59a696ba3e4158a70eeef:sha256:e23abb2b07eea9eb6b756cc23a8061b58881ab9ab8eff98f45b492a07b3e5d21:0x37158dbcb9a4264baae33190614aa21a9bf52f9ddfa55f86e144fe2647e0ba6a",
      "syncStatus": "READY_FOR_AGENCY"
    },
    "computeFootprint": {
      "accountingStatus": "unquantified",
      "aiUsage": true
    },
    "media": {
      "candidates": [],
      "candidateCount": 0,
      "publicationAuthorized": false,
      "approvalScope": "school_editorial_clearance_before_web_publication",
      "schoolOnlyStatus": "five child photos school_only; technical ZIP contains restricted hashes and reported venue",
      "technicalZipContainsOriginalMedia": false
    },
    "source": {
      "dashboardSyncSha256": "840dd968e75b6d54780312316d455810588263d80fda5324282bc0dc7d75e95c",
      "technicalZipSha256": "823f4b0247e4dfaf36bc08510ba23b2df6472dd20d4f3160d3c812d0bf2e2c62",
      "relativePath": "02_INSTITUTIONS/spn_776c056a5d48505e28e48471_Montessori/01_ACTIONS/spa_e3f59a696ba3e4158a70eeef_03_plantacion_tandil"
    }
  }
};
