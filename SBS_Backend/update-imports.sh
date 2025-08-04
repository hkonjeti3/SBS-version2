#!/bin/bash

# Update import statements to reflect new package structure
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.dto\./import com.securebanking.sbs.shared.dto./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.model\./import com.securebanking.sbs.shared.model./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.repository\./import com.securebanking.sbs.infrastructure.repository./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.service\./import com.securebanking.sbs.infrastructure.service./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.controller\.service\./import com.securebanking.sbs.infrastructure.service./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.exception\./import com.securebanking.sbs.core.exception./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.iservice\./import com.securebanking.sbs.infrastructure.iservice./g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.controller\./import com.securebanking.sbs.infrastructure.controller./g' {} \;

# Update specific model imports for customer and internal-user modules
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.Account/import com.securebanking.sbs.modules.customer.model.Account/g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.Transaction/import com.securebanking.sbs.modules.customer.model.Transaction/g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.TransactionAuthorization/import com.securebanking.sbs.modules.customer.model.TransactionAuthorization/g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.AccountRequest/import com.securebanking.sbs.modules.internal-user.model.AccountRequest/g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.ProfileUpdateRequest/import com.securebanking.sbs.modules.internal-user.model.ProfileUpdateRequest/g' {} \;
find . -name "*.java" -exec sed -i '' 's/import com.securebanking.sbs.shared.model.UserProfileUpdateRequest/import com.securebanking.sbs.modules.internal-user.model.UserProfileUpdateRequest/g' {} \;

echo "Import statements updated successfully!" 