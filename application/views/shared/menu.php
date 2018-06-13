<!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <a href="inicio" class="brand-link">
      <img src="<?php echo base_url(); ?>/assets/dist/img/bk.webp" alt="BanKey" class="brand-image img-circle elevation-3"
           style="opacity: .8">
      <span class="brand-text font-weight-light">BanKey 1.0</span>
    </a>

    <!-- Sidebar -->
    <div class="sidebar" style="height: 540px">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="<?php echo base_url(); ?>assets/dist/img/default.jpg" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a href="#" class="d-block"><?php echo $this->session->userdata('usuario'); ?></a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-item has-treeview menu-open">
            <a href="#" class="nav-link active">
              <i class="nav-icon fa fa-dashboard"></i>
              <p>
                Dashboard
                <i class="right fa fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="inicio" class="nav-link">
                  <i class="fa fa-home nav-icon"></i>
                  <p>Home</p>
                </a>
              </li>
              
            </ul>
          </li>

          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="nav-icon fa fa-book"></i>
              <p>
                Clientes
                <i class="right fa fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="clientes" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Ver</p>
                </a>
              </li>
              
            </ul>
          </li>
          
          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="nav-icon fa fa-pie-chart"></i>
              <p>
                Creditos
                <i class="right fa fa-angle-left"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="Creditos" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Ver</p>
                </a>
              </li>
              
            </ul>
          </li>
          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="nav-icon fa fa-money"></i>
              <p>
                Gastos
                <i class="fa fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="gastos" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Ver</p>
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="nav-icon fa fa-edit"></i>
              <p>
                Sistema
                <i class="fa fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="usuarios" class="nav-link">
                  <i class="fa fa-users nav-icon"></i>
                  <p>Usuarios</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="roles" class="nav-link">
                  <i class="fa fa-cogs nav-icon"></i>
                  <p>Roles</p>
                </a>
              </li>
              
            </ul>
          </li>
          
          <li class="nav-header">Reportes</li>
          <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
              <i class="nav-icon fa fa-line-chart"></i>
              <p>
                Reportes
                <i class="fa fa-angle-left right"></i>
              </p>
            </a>
            <ul class="nav nav-treeview">
              <li class="nav-item">
                <a href="reportes-facturas" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Reportes Facturas</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="reportes-clientes" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Reportes Clientes</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="reportes-viaticos" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Reportes Pagos</p>
                </a>
              </li>
              <li class="nav-item">
                <a href="reporte-gastos" class="nav-link">
                  <i class="fa fa-chevron-circle-right nav-icon"></i>
                  <p>Reportes Gastos</p>
                </a>
              </li>
            </ul>
          </li>
          
          <li class="nav-header">Sesion</li>

          <li class="nav-item has-treeview">
            <a href="cerrarsesion" class="nav-link">
              <i class="nav-icon fa fa-sign-out"></i>
              <p>
                Cerrar Sesion
                
              </p>
            </a>
            
          </li>

        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>