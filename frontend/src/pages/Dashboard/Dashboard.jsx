import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

function Dashboard() {
  return (
    <div style={{ maxWidth: "900px" }}>
      <Card>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Button>Primary Button</Button>

          <Button variant="secondary">
            Secondary Button
          </Button>

          <Button variant="danger">
            Delete
          </Button>

          <Button size="large">
            Large Button
          </Button>
        </div>

        <div style={{ marginTop: "24px", maxWidth: "450px" }}>
          <Input placeholder="Enter your username" />
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;