import * as React from "react";
import { Badge, Card, Col, ProgressBar, Row } from "react-bootstrap";
import ActionsCell from "./ActionsCell";
export interface SavingsCardProps {
  index: number;
  id: string;
  bankBalance: number;
  itemGoalCost: number;
  name: string;
  editGoal: (goalID: string) => void;
  deleteGoal: (goalID: string) => void;
}

export interface SavingsCardState {}

class SavingsCard extends React.Component<SavingsCardProps, SavingsCardState> {
  constructor(props: SavingsCardProps) {
    super(props);
    this.state = {};
  }
  /**
   * Provides the name of the color you want to use for the progressBar/Badges depending on how close to your goals you are
   *
   * @param percentage - The percent of goal Cost divided by Savings Balance
   * @returns - The string for correct coloring for bootstrap
   *
   */
  progressBarColor(percentage: number): string {
    if (percentage >= 100) {
      return "success";
    } else if (percentage >= 50 && percentage < 100) {
      return "warning";
    } else {
      return "danger";
    }
  }
  render() {
    const now = Math.round(
      (this.props.bankBalance / this.props.itemGoalCost) * 100
    );
    const progressInstance = (
      <ProgressBar
        max={100}
        now={now}
        label={`${now}%`}
        variant={this.progressBarColor(now)}
      />
    );

    return (
      <div>
        <Card body>
          <Card.Title>
            {this.props.name}
            <h5>
              <Badge pill variant={this.progressBarColor(now)}>
                ${this.props.bankBalance}
              </Badge>{" "}
              of{" "}
              <Badge pill variant="primary">
                ${this.props.itemGoalCost}
              </Badge>
            </h5>
          </Card.Title>

          <Row>
            <Col sm={11}>{progressInstance}</Col>
            <Col sm={1}>
              <ActionsCell
                id={this.props.id}
                handleViewEdit={this.props.editGoal}
                handleDelete={this.props.deleteGoal}
              />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default SavingsCard;
