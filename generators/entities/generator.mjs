/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import BaseApplicationGenerator from '../base-application/index.mjs';
import { GENERATOR_ENTITIES, GENERATOR_APP } from '../generator-list.mjs';
import command from './command.mjs';

export default class EntitiesGenerator extends BaseApplicationGenerator {
  entities;

  async beforeQueue() {
    if (!this.fromBlueprint) {
      await this.composeWithBlueprints(GENERATOR_ENTITIES);
    }
  }

  get initializing() {
    return this.asInitializingTaskGroup({
      loadArguments() {
        this.jhipsterConfig.entities = this.jhipsterConfig.entities || [];

        this.parseJHipsterArguments(command.arguments);
        if (!this.entities || this.entities.length === 0) {
          this.entities = this.getExistingEntityNames();
        }
        if (this.entities) {
          this.log.verboseInfo('Generating entities', ...this.entities);
        }
      },
      loadOptions() {
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.delegateTasksToBlueprint(() => this.initializing);
  }

  get composing() {
    return {
      async composeApp() {
        await this.composeWithJHipster(GENERATOR_APP, {
          generatorOptions: { skipPriorities: ['writing', 'postWriting'], entities: this.entities },
        });
      },
    };
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.delegateTasksToBlueprint(() => this.composing);
  }
}
