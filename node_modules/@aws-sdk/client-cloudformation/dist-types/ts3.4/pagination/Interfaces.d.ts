import { PaginationConfiguration } from "@smithy/types";
import { CloudFormationClient } from "../CloudFormationClient";
export interface CloudFormationPaginationConfiguration
  extends PaginationConfiguration {
  client: CloudFormationClient;
}
