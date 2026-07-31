<?php
require_once 'header.php';
if ($current_user['role'] !== 'manager') {
    echo "<div class='container'><p>Unauthorized access.</p></div>";
    require_once 'footer.php';
    exit();
}

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_agent'])) {
    $uname = trim($_POST['username']);
    $pass  = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $email = trim($_POST['email']);
    $num   = trim($_POST['number']);
    $cntry = trim($_POST['country']);

    $stmt = $conn->prepare("INSERT INTO users (username, password, role, email, number, country, status) VALUES (?, ?, 'agent', ?, ?, ?, 'Active')");
    $stmt->bind_param("sssss", $uname, $pass, $email, $num, $cntry);
    if ($stmt->execute()) {
        $msg = "Agent created successfully!";
    } else {
        $msg = "Error: Username may already exist.";
    }
}

$agents = $conn->query("SELECT * FROM users WHERE role = 'agent' ORDER BY id DESC");
?>

<div class="breadcrumb-container">
    <a href="dashboard.php">Home</a> » Agents
</div>

<div class="container">
    <h2>Manage Agents</h2>
    <?php if ($msg): ?><p style="color: green; margin: 10px 0;"><?php echo htmlspecialchars($msg); ?></p><?php endif; ?>

    <div class="table-container" style="margin-bottom: 20px;">
        <h3>Add New Agent</h3>
        <form method="POST">
            <div class="form-group">
                <label>Username</label>
                <input type="text" name="username" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="form-group">
                <label>Number</label>
                <input type="text" name="number" class="form-control" placeholder="+92..." required>
            </div>
            <div class="form-group">
                <label>Country</label>
                <input type="text" name="country" class="form-control" value="Pakistan" required>
            </div>
            <button type="submit" name="add_agent" class="btn btn-primary">Add Agent</button>
        </form>
    </div>

    <div class="table-container">
        <h3>Existing Agents</h3>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Country</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php while ($row = $agents->fetch_assoc()): ?>
                <tr>
                    <td><?php echo htmlspecialchars($row['username']); ?></td>
                    <td><?php echo htmlspecialchars($row['email']); ?></td>
                    <td><?php echo htmlspecialchars($row['number']); ?></td>
                    <td><?php echo htmlspecialchars($row['country']); ?></td>
                    <td><?php echo htmlspecialchars($row['status']); ?></td>
                </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>

<?php require_once 'footer.php'; ?>
