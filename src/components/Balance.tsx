import * as React from "react";
import { Col, Form, Row } from "react-bootstrap";
export interface BalanceProps {
  savingsBalance: number;
  updateSavingsBalance: (savingsBalance: number) => void;
}

export interface BalanceState {
  savingsBalance: number;
}

class Balance extends React.Component<BalanceProps, BalanceState> {
  constructor(props: BalanceProps) {
    super(props);
    this.state = {
      savingsBalance: this.props.savingsBalance
        ? this.props.savingsBalance
        : 0.0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.moneyValidation = this.moneyValidation.bind(this);
  }
  handleInputChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const target = event.target;
    const value = target.value;

    this.setState({
      savingsBalance: this.moneyValidation(value),
    });
  }
  handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
    const target = event.target;
    const value = target.value;
    if (value) {
      this.saveBalance(value);
    }
  }
  /**
   * Internal function to make sure the value is validated before calling hte UpdateSavingsBalance function in the main Editor Component to save and update the State/Editor for the new balance
   *
   * @param balance - The Balance you want to save
   * @returns void
   *
   */
  saveBalance(balance: string): void {
    if (balance) {
      this.setState(
        {
          savingsBalance: this.moneyValidation(balance),
        },
        () =>
          this.props.updateSavingsBalance(
            this.moneyValidation(this.state.savingsBalance.toString())
          )
      );
    }
  }
  //TODO: Do input validation here and return 0 if bad
  /**
   * Validates the balance you type in to the Balance Text Box to make sure it is formatted correctly and converts to an number type
   *
   * @param value - The Balance you want to save as a string
   * @returns - The value as a number parsed correctly
   *
   */
  moneyValidation(value: string): number {
    return parseFloat(value) || 0;
  }
  render() {
    return (
      <div>
        {" "}
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h1 className="text-center">~Savings Balance~</h1>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
              }}
            >
              <Form.Group controlId="savingsBalance">
                <Form.Control
                  type="text"
                  size="lg"
                  placeholder="Enter balance of savings"
                  name="savingsBalance"
                  value={this.state.savingsBalance}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
                    this.setState({
                      savingsBalance: this.moneyValidation(e.target.value),
                    })
                  }
                  onBlur={this.handleOnBlur}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

export default Balance;
