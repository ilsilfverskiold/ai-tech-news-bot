import { Paginator } from "@smithy/types";
import {
  ListExportsCommandInput,
  ListExportsCommandOutput,
} from "../commands/ListExportsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListExports: (
  config: CloudFormationPaginationConfiguration,
  input: ListExportsCommandInput,
  ...rest: any[]
) => Paginator<ListExportsCommandOutput>;
