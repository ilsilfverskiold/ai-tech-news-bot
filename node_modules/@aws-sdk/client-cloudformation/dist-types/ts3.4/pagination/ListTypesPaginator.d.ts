import { Paginator } from "@smithy/types";
import {
  ListTypesCommandInput,
  ListTypesCommandOutput,
} from "../commands/ListTypesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListTypes: (
  config: CloudFormationPaginationConfiguration,
  input: ListTypesCommandInput,
  ...rest: any[]
) => Paginator<ListTypesCommandOutput>;
