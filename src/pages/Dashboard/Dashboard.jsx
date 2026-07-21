import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

function Dashboard() {
  return (
    <div>
      <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
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

      <div style={{ marginTop: "24px", maxWidth: "350px" }}>
        <Input placeholder="Enter your username" />
      </div>
    </div>
  );
}

export default Dashboard;