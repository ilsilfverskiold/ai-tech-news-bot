import { Paginator } from "@smithy/types";
import {
  ListGeneratedTemplatesCommandInput,
  ListGeneratedTemplatesCommandOutput,
} from "../commands/ListGeneratedTemplatesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListGeneratedTemplates: (
  config: CloudFormationPaginationConfiguration,
  input: ListGeneratedTemplatesCommandInput,
  ...rest: any[]
) => Paginator<ListGeneratedTemplatesCommandOutput>;
